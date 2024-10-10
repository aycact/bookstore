import {
  SectionTitle,
  CartTotal,
  FormInput,
  RadiosInput,
  Loading,
} from '../../components'
import {
  quaternaryBgColorLight,
  shadow1,
  textColor,
  transition,
} from '../../assets/js/variables'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { emptyCart } from '../../assets/images'
import { useEffect, useState } from 'react'

import { createOrder, updateOrder } from '../../features/orders/orderSlice'
import { clearCart } from '../../features/cart/cartSlice'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { customFetch } from '../../utils/axios'
import { toast } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'
import { clearStore } from '../../features/users/userSlice'
const client_id = import.meta.env.VITE_PAYPAL_CLIENT_ID
const client_secret = import.meta.env.VITE_PAYPAL_CLIENT_SECRET

const initialOptions = {
  'client-id': client_id,
  'enable-funding': 'venmo',
  'disable-funding': '',
  'buyer-country': 'US',
  currency: 'USD',
  'data-page-type': 'product-details',
  components: 'buttons',
  'data-sdk-integration-source': 'developer-studio',
}

const paymentMethods = ['COD', 'Card', 'E-Wallet', 'Bank Transfer']

const showCurrentUser = () => {
  const {
    isLoading,
    data: userData,
    error,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['showMe'],
    queryFn: async () => {
      const response = await customFetch(`/users/showMe`) // đảm bảo sử dụng await đúng cách
      return response.data // trả về dữ liệu cần thiết
    },
  })

  return { isLoading, userData, error, isError, refetch }
}

const Checkout = () => {
  const dispatch = useDispatch()
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { isLoading, userData, error, isError, refetch } = showCurrentUser()

  const [values, setValues] = useState({
    recipientName: userData?.name || '',
    recipientAddress: userData?.address || '',
    recipientPhoneNumber: userData?.phone_number || '',
    paymentMethods: 'COD',
  })

  useEffect(() => {
    if (userData) {
      setValues({
        recipientName: userData?.name || '',
        recipientAddress: userData?.address || '',
        recipientPhoneNumber: userData?.phone_number || '',
        paymentMethods: 'COD',
      })
    }
  }, [userData])

  const { cartItems, cartTotal, shipping, tax, orderTotal, numItemsInCart } =
    useSelector((store) => store.cart)

  useEffect(() => {
    const radios = document.getElementsByName('paymentMethods')
    radios.forEach((radio) => {
      if (radio.value === values.paymentMethods) {
        radio.checked = true
      }
    })
  }, [loading, isLoading])

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setValues({ ...values, [name]: value })
  }

  const getFundingSource = () => {
    switch (values.paymentMethods) {
      case 'E-Wallet':
        return 'paypal'
      case 'Card':
        return 'card'
      default:
        return 'card'
    }
  }

  const createPaypalOrder = async () => {
    try {
      const order = {
        customer_email: userData?.email,
        shipping_address: values.recipientAddress || userData?.address,
        payment_method: values.paymentMethods,
        book_list: cartItems,
        subtotal: cartTotal,
        shipping_fee: shipping,
        tax,
        cart_total: orderTotal,
        user_id: userData?.id,
        recipient_name: values.recipientName || userData?.name,
        recipient_phone: values.recipientPhoneNumber || userData?.phone_number,
      }
      console.log(order)

      if (
        !order.shipping_address ||
        !order.recipient_name ||
        !order.recipient_phone
      )
        toast.warning('Xin hãy điền đầy đủ thông tin thanh toán!')

      const response = await customFetch.post(
        '/orders/paypal/createOrder',
        order,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const orderData = await response.data
      if (orderData.id) {
        return orderData.id
      } else {
        const errorDetail = orderData?.details?.[0]
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData)

        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error(error)
      setMessage(`Could not initiate PayPal Checkout...${error}`)
    }
  }

  const approvePaypalOrder = async (data, actions) => {
    try {
      const response = await customFetch.post(
        `/orders/paypal/${data.orderID}/captureOrder`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      const orderData = await response.data
      // Three cases to handle:
      //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
      //   (2) Other non-recoverable errors -> Show a failure message
      //   (3) Successful transaction -> Show confirmation or thank you message

      const errorDetail = orderData?.details?.[0]

      if (errorDetail?.issue === 'INSTRUMENT_DECLINED') {
        // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
        // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
        return actions.restart()
      } else if (errorDetail) {
        // (2) Other non-recoverable errors -> Show a failure message
        throw new Error(`${errorDetail.description} (${orderData.debug_id})`)
      } else {
        // (3) Successful transaction -> Show confirmation or thank you message
        // Or go to another URL:  actions.redirect('thank_you.html');
        const transaction = orderData.purchase_units[0].payments.captures[0]
        setMessage(
          `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
        )
        console.log(
          'Capture result',
          orderData,
          JSON.stringify(orderData, null, 2)
        )
        if (
          orderData?.purchase_units[0]?.payments?.captures[0]?.status ===
          'COMPLETED'
        ) {
          dispatch(clearCart())
          toast.success('Thanh toán thành công. Vui lòng kiểm tra đơn hàng!')
        }
      }
    } catch (error) {
      console.error(error)
      setMessage(`Sorry, your transaction could not be processed...${error}`)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const order = {
        customer_email: userData.email,
        shipping_address: values.recipientAddress || userData.address,
        payment_method: values.paymentMethods,
        book_list: cartItems,
        subtotal: cartTotal,
        shipping_fee: shipping,
        tax,
        cart_total: orderTotal,
        user_id: userData?.id,
        recipient_name: values.recipientName || userData.name,
        recipient_phone: values.recipientPhoneNumber || userData.phone_number,
      }

      if (
        !order.shipping_address ||
        !order.recipient_name ||
        !order.recipient_phone
      ) {
        toast.warning('Xin hãy điền đầy đủ thông tin thanh toán!')
        return
      }

      if (order.payment_method === 'COD') {
        dispatch(createOrder(order))
        dispatch(clearCart())
      } else {
        console.log('Loading...')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading />
  }
  if (isLoading) {
    return <Loading />
  }
  if (isError) {
    if (error?.response?.status === 401) {
      dispatch(clearStore())
      return
    }
    return <p style={{ marginTop: '1rem' }}>{error.message}</p>
  }

  if (numItemsInCart === 0)
    return (
      <Wrapper>
        <div className="d-flex justify-content-center align-items-center flex-column">
          <h2>Giỏ hàng của bạn đang trống!</h2>
          <img src={emptyCart} alt="empty-cart" className="empty-cart-img" />
        </div>
      </Wrapper>
    )
  return (
    <Wrapper>
      <SectionTitle text="Thông tin thanh toán" />

      {/* chia thành 12 cột */}
      <div className="row checkout-container justify-content-around">
        {/* Item chiếm 8 cột */}
        <div className="col-5">
          <div>
            <FormInput
              type="text"
              label="Tên người nhận"
              name="recipientName"
              value={values.recipientName}
              handleChange={handleChange}
            />
            <FormInput
              type="text"
              label="Số điện thoại người nhận"
              name="recipientPhoneNumber"
              value={values.recipientPhoneNumber}
              handleChange={handleChange}
            />
            <FormInput
              type="text"
              label="Địa chỉ nhận hàng"
              name="recipientAddress"
              value={values.recipientAddress}
              handleChange={handleChange}
            />
            <p className="radio-label mt-3">Hình thức thanh toán:</p>
            {paymentMethods.map((paymentMethod) => {
              return (
                <RadiosInput
                  key={paymentMethod}
                  name="paymentMethods"
                  value={paymentMethod}
                  label={paymentMethod}
                  handleCheck={handleChange}
                />
              )
            })}
            <div
              className="btn-container"
              style={{
                width: values.paymentMethods === 'COD' ? '80%' : '0rem',
                height: '2rem',
              }}
            >
              <button className="btn" onClick={handleSubmit}>
                Đặt hàng
              </button>
            </div>
            <div
              className="btn-container"
              style={{
                width: values.paymentMethods !== 'COD' ? '100%' : '0rem',
              }}
            >
              <PayPalScriptProvider
                options={initialOptions}
                key={JSON.stringify(values)}
              >
                <PayPalButtons
                  fundingSource={getFundingSource()}
                  createOrder={createPaypalOrder}
                  onApprove={approvePaypalOrder}
                />
              </PayPalScriptProvider>
            </div>
          </div>
        </div>
        {/* cart total chiếm 4 cột */}
        <div className="col-5 checkout-column">
          <div className="total-container">
            <CartTotal />
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

export default Checkout

const Wrapper = styled.section`
  margin-top: 6rem;
  padding-bottom: 3rem;
  .checkout-container {
    padding: 0 5rem;
    margin: 2rem 0;
  }
  .btn-container {
    margin-top: 1rem;
    overflow: hidden;
    float: left;
  }

  .btn {
    color: ${textColor};
    cursor: pointer;
    background-color: ${quaternaryBgColorLight};
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    box-shadow: ${shadow1};
    font-weight: 600;
    text-transform: uppercase;
  }
  .empty-cart-img {
    height: 20rem;
    width: 20rem;
  }
  .total-container {
    position: sticky;
    top: 5rem;
  }
  .radio-label {
    margin: 0;
    font-weight: bold;
  }
  .header {
    margin-left: 3rem;
  }
  h2 {
    font-weight: bold;
  }
  .form-check {
    margin-bottom: 1rem 0;
    width: 27rem;
  }
  .paypal-buttons {
    z-index: 1;
  }
`

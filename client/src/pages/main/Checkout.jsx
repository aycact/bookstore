import {
  SectionTitle,
  CartTotals,
  FormInput,
  RadiosInput,
} from '../../components'
import {
  quaternaryBgColorLight,
  shadow1,
  textColor,
} from '../../assets/js/variables'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { emptyCart } from '../../assets/images'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { createOrder, updateOrder } from '../../features/orders/orderSlice'
import { clearCart } from '../../features/cart/cartSlice'

const initialState = {
  recipientName: '',
  recipientAddress: '',
  recipientPhoneNumber: '',
  paymentMethods: 'COD',
}

const paymentMethods = [
  'COD',
  'Credit Card',
  'Debit Card',
  'E-Wallet',
  'Bank Transfer',
]

const Checkout = () => {
  const [values, setValues] = useState(initialState)
  const { user } = useSelector((store) => store.user)
  const { cartItems, cartTotal, shipping, tax, orderTotal } = useSelector(
    (store) => store.cart
  )
  const dispatch = useDispatch()

  useEffect(() => {
    const radios = document.getElementsByName('paymentMethods')
    radios.forEach((radio) => {
      if (radio.value === 'COD') {
        radio.checked = true
      }
    })
  }, [])

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setValues({ ...values, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Lưu giá trị và đưa đến trang thanh toán
    const order = {
      customer_name: user.name,
      customer_email: user.email,
      customer_phone: user.phoneNumber,
      shipping_address: values.recipientAddress || user.address,
      payment_method: values.paymentMethods,
      book_list: cartItems,
      subtotal: cartTotal,
      shipping_fee: shipping,
      tax,
      cart_total: orderTotal,
      user_id: user.userId,
      recipient_name: values.recipientName,
      recipient_phone: values.recipientPhoneNumber,
    }

    if (order.payment_method === 'COD') {
      dispatch(createOrder(order))
      dispatch(clearCart())
    } else {
      console.log('Loading...')
    }
  }

  const { numItemsInCart } = useSelector((store) => store.cart)
  if (numItemsInCart === 0)
    return (
      <Wrapper>
        <div className="d-flex justify-content-center align-items-center flex-column">
          <h2>Your cart is empty!</h2>
          <img src={emptyCart} alt="empty-cart" className="empty-cart-img" />
          <h2>Please put in some books</h2>
        </div>
      </Wrapper>
    )
  return (
    <Wrapper>
      <SectionTitle text="Place Your Order" />

      {/* chia thành 12 cột */}
      <div className="row checkout-container justify-content-around">
        {/* Item chiếm 8 cột */}
        <div className="col-5">
          <div>
            <FormInput
              type="text"
              label="Recipient Name"
              name="recipientName"
              value={values.recipientName}
              handleChange={handleChange}
            />
            <FormInput
              type="text"
              label="Recipient Phone Number"
              name="recipientPhoneNumber"
              value={values.recipientPhoneNumber}
              handleChange={handleChange}
            />
            <FormInput
              type="text"
              label="Recipient Address"
              name="recipientAddress"
              value={values.address}
              handleChange={handleChange}
            />
            <p className="font-italic m-0">
              * In the case you have relative helping receive your package.
            </p>
            <p className="radio-label">Payment Methods:</p>
            {paymentMethods.map((method) => {
              return (
                <RadiosInput
                  key={method}
                  name="paymentMethods"
                  value={method}
                  label={method}
                  defaultValue={values.paymentMethods}
                  handleCheck={handleChange}
                />
              )
            })}
            <br />
            <button className="btn" onClick={handleSubmit}>
              Place Your Order
            </button>
          </div>
        </div>
        {/* cart total chiếm 4 cột */}
        <div className="col-5 checkout-column">
          <div className="total-container">
            <CartTotals />
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
`

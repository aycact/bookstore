import store from '../../store'
import { customFetch } from '../axios'
import { recalculateShipping } from '../../features/cart/cartSlice'

export const createPaypalOrder = async ({
  userData,
  values,
  cartItems,
  cartTotal,
  shippingFee,
  orderTotal,
}) => {
  try {
    const order = {
      customer_email: userData?.email,
      shipping_address: values.recipientAddress || userData?.address,
      payment_method: values.paymentMethods,
      book_list: cartItems,
      subtotal: cartTotal,
      shipping_fee: shippingFee,
      cart_total: orderTotal,
      user_id: userData?.id,
      recipient_name: values.recipientName || userData?.name,
      recipient_phone: values.recipientPhoneNumber || userData?.phone_number,
      coupon: values?.coupon || '',
    }

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
  } finally {
    store.dispatch(recalculateShipping(0))
  }
}

export const approvePaypalOrder = async (data, actions) => {
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

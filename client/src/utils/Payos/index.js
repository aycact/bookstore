import { customFetch } from '../axios'
import { clearCart, recalculateShipping } from '../../features/cart/cartSlice'
import store from '../../store'
import { toast } from 'react-toastify'



export const handleSubmitPayOS =
  async ({ userData, values, cartItems, cartTotal, shippingFee, orderTotal, setLoading }) => {
   
    try {
      const order = {
        customer_email: userData.email,
        shipping_address: values.recipientAddress || userData.address,
        payment_method: values.paymentMethods,
        book_list: cartItems,
        subtotal: cartTotal,
        shipping_fee: shippingFee,
        cart_total: orderTotal,
        user_id: userData?.id,
        recipient_name: values.recipientName || userData.name,
        recipient_phone: values.recipientPhoneNumber || userData.phone_number,
        coupon: values.coupon || '',
      }

      if (
        !order.shipping_address ||
        !order.recipient_name ||
        !order.recipient_phone
      ) {
        toast.warning('Xin hãy điền đầy đủ thông tin thanh toán!')
        return
      }

      const response = await customFetch.post('/orders/createPayOSLink', order)
      window.location.href = response?.data?.paymentLink?.checkoutUrl
      store.dispatch(clearCart())
      return
    } catch (error) {
      console.log(error)
    } finally {
      store.dispatch(recalculateShipping(0))
      store.dispatch(clearCart())
    }
  }

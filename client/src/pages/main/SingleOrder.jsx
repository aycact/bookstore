import dateFormat, { masks } from 'dateformat'
import { customFetch } from '../../utils/axios'
import { redirect, useLoaderData } from 'react-router-dom'
import styled from 'styled-components'
import {
  CustomerContactInfo,
  OrderSummary,
  ShippingAddress,
  OrderItemsList,
  CustomerInstruction,
  Loading,
} from '../../components'
import {
  boldTextColor,
  shadow1,
  quaternaryBgColorLight,
  primaryBgColorHover,
  textColor,
} from '../../assets/js/variables'
import { i18n } from 'dateformat'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { useSelector } from 'react-redux'

i18n.dayNames = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'CN',
  'T2',
  'T3',
  'T4',
  'T5',
  'T6',
  'T7',
]

i18n.monthNames = [
  'Th 1',
  'Th 2',
  'Th 3',
  'Th 4',
  'Th 5',
  'Th 6',
  'Th 7',
  'Th 8',
  'Th 9',
  'Th 10',
  'Th 11',
  'Th 12',
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
]

i18n.timeNames = ['a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM']

const getUserSingleOrder = (id) => {
  return {
    queryKey: ['userOrder', id || ''],
    queryFn: () => customFetch(`/orders/${id}`),
  }
}

const getSingleUser = (id) => {
  return {
    queryKey: ['showMe,', id || ''],
    queryFn: async () => customFetch(`/users/${id}`),
  }
}

export const loader =
  (store, queryClient) =>
  async ({ params }) => {
    const { id } = params

    const responseOrder = await queryClient.ensureQueryData(
      getUserSingleOrder(id)
    )
    const order = responseOrder.data.order
    const coupon = responseOrder?.data?.coupon
    const responseUser = await queryClient.ensureQueryData(
      getSingleUser(order.user_id)
    )
    const user = responseUser.data.user
    return { order, user, coupon }
  }

const SingleOrder = () => {
  const { order, user, coupon } = useLoaderData()

  const { user: currentUser } = useSelector((store) => store.user)

  const [loading, setLoading] = useState(false)
  const [requestCancel, setRequestCancel] = useState(false)

  const handleSubmitPayOS = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const existingOrder = {
        customer_email: order.customer_email,
        shipping_address: order.shipping_address,
        payment_method: order.payment_method,
        book_list: order.book_list,
        subtotal: order.subtotal,
        shipping_fee: order.shipping_fee,
        tax: order.tax,
        cart_total: order.total,
        user_id: order.user_id,
        recipient_name: order.recipient_name,
        recipient_phone: order.recipient_phone,
        payos_order_code: order.payos_order_code,
      }

      if (
        !existingOrder.shipping_address ||
        !existingOrder.recipient_name ||
        !existingOrder.recipient_phone
      ) {
        toast.warning('Xin hãy điền đầy đủ thông tin thanh toán!')
        return
      }

      const response = await customFetch.post(
        '/orders/repayExistingOrderPayOS',
        existingOrder
      )
      console.log(response)

      window.location.href = `https://pay.payos.vn/web/${response?.data?.paymentLink?.paymentLinkId}`
      return
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestCancelOrder = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await customFetch.patch(
        `/orders/requestCancelOrder/${order.id}`
      )
      toast.success(response?.data?.msg)
      setRequestCancel(true)
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.msg)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await customFetch.patch(`/orders/${order.id}`, {
        status: 'đã hủy',
        request_cancel: false,
      })
      toast.success('Cập nhật đơn hàng thành công')
      setRequestCancel(false)
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.msg)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmOrder = async (e) => {
    e.preventDefault()
      try {
        setLoading(true)
        await customFetch.patch(`/orders/${order.id}`, {
          status: 'chờ lấy hàng',
        })
        toast.success('Cập nhật đơn hàng thành công')
      } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.msg)
      } finally {
        setLoading(false)
      }
  }
  const handleDeliverOrder = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await customFetch.patch(`/orders/${order.id}`, {
        status: 'đang vận chuyển',
      })
      toast.success('Cập nhật đơn hàng thành công')
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.msg)
    } finally {
      setLoading(false)
    }
  }

  const handleSuccessDeliverOrder = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await customFetch.patch(`/orders/${order.id}`, {
        status: 'đã giao',
      })
      toast.success('Cập nhật đơn hàng thành công')
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.msg)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading />
  }
  return (
    <Wrapper>
      <div className="container order-detail">
        <div className="header">
          <h1 className="order-code">Mã đơn hàng : {order.id}</h1>
          <div className="fw-bold order-date">
            Ngày đặt hàng :{' '}
            <span className="fw-normal">
              {dateFormat(order.created_at, 'dddd, dd mmmm, yyyy')}
            </span>
            <div
              className={`badge bg-${
                order.is_paid ? 'success' : 'warning'
              } ms-2`}
              style={{
                textTransform: 'uppercase',
                color: '#000',
              }}
            >
              {order.is_paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
            </div>
            <div
              className={`badge bg-${
                (order.status === 'chờ xác nhận' && 'warning') ||
                (order.status === 'đã hủy' ? 'danger' : 'success')
              } ms-2`}
              style={{
                textTransform: 'uppercase',
                color: '#000',
              }}
            >
              {order.status}
            </div>
            {(requestCancel || order.request_cancel) && (
              <div
                className="badge bg-danger ms-2"
                style={{
                  textTransform: 'uppercase',
                  color: '#000',
                }}
              >
                Yêu cầu hủy
              </div>
            )}
          </div>
        </div>
        <div className="row">
          {/* CustomerContactInfo */}
          <div className="col">
            <CustomerContactInfo userInfo={user} />
          </div>
          {/* ShippingAddress */}
          <div className="col">
            <ShippingAddress orderInfo={order} />
          </div>
          <div className="col">
            <CustomerInstruction
              paymentMethod={order.payment_method}
              orderInfo={order}
              coupon={coupon}
            />
          </div>
        </div>
        {/* chia thành 12 cột */}
        <div className="row">
          {/* Item chiếm 8 cột */}
          <div className="col-8">
            <OrderItemsList itemList={order.book_list} />
          </div>
          {/* cart total chiếm 4 cột */}
          <div className="col-4">
            <div className="d-flex flex-column info-container">
              {/* OrderSummary */}
              <OrderSummary orderInfo={order} coupon={coupon} />

              {/* PayOs button */}
              {!order.is_paid && order.payos_order_code && (
                <button
                  type="button"
                  className="btn btn-success mt-2"
                  onClick={handleSubmitPayOS}
                >
                  Thanh toán qua ngân hàng
                </button>
              )}
              {/* Nút yêu cầu hủy đơn hàng */}
              {currentUser.role === 'user' && (
                <button
                  disabled={
                    order.status !== 'chờ xác nhận' ||
                    requestCancel ||
                    order.request_cancel
                  }
                  type="button"
                  className="btn btn-success mt-2"
                  onClick={handleRequestCancelOrder}
                >
                  Yêu cầu hủy đơn hàng
                </button>
              )}
              {currentUser.role === 'admin' &&
                order.status === 'đang vận chuyển' && (
                  <button
                    type="button"
                    className="btn btn-success mt-2"
                    onClick={handleSuccessDeliverOrder}
                  >
                    Xác nhận đã giao
                  </button>
                )}
              {currentUser.role === 'admin' &&
                order.status === 'chờ lấy hàng' && (
                  <button
                    type="button"
                    className="btn btn-success mt-2"
                    onClick={handleDeliverOrder}
                  >
                    Xác nhận giao hàng
                  </button>
                )}
              {currentUser.role === 'admin' &&
                order.status === 'chờ xác nhận' && (
                  <button
                    type="button"
                    className="btn btn-success mt-2"
                    onClick={handleConfirmOrder}
                  >
                    Xác nhận đơn hàng
                  </button>
                )}
              {currentUser.role === 'admin' && (
                <button
                  type="button"
                  className="btn btn-danger mt-2"
                  onClick={handleCancelOrder}
                >
                  Hủy đơn hàng
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

export default SingleOrder

const Wrapper = styled.section`
  margin-top: 6rem;
  padding-bottom: 2rem;
  .order-code {
    font-weight: 600;
    font-size: 2rem;
    color: ${boldTextColor};
  }
  .order-date {
    color: ${textColor};
  }
  .order-detail {
    background-color: ${quaternaryBgColorLight};
    border-radius: 2rem;
    padding: 2rem;
    margin-top: 1rem;
    box-shadow: ${shadow1};
  }
  .header {
    border-bottom: solid 2px ${primaryBgColorHover};
    margin-bottom: 1rem;
  }
  .info-container {
    color: #000;
  }
  h5 {
    color: #000;
  }
  .btn-container {
    margin-top: 1rem;
  }
`

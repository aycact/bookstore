import day from 'dayjs'
import Table from 'react-bootstrap/Table'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import { quaternaryBgColor } from '../../assets/js/variables'
import { useEffect } from 'react'
import { formatPrice } from '../../utils'
import Badge from 'react-bootstrap/Badge'
import { customFetch } from '../../utils/axios'
import { useLoaderData } from 'react-router-dom'
day.extend(advancedFormat)

const TotalOrdersList = () => {
  const getTotalOrders = async () => {
    const resp = await customFetch('orders')
    return
  }

  const { orders } = useLoaderData()
  const tr = document.getElementsByTagName('tr')

  useEffect(() => {
    Array.from(tr).forEach((row) => {
      if (Number(row.id) % 2 === 0) {
        Array.from(row.childNodes).forEach((child) => {
          child.style.backgroundColor = quaternaryBgColor
        })
      }
    })
  }, [orders])

  return (
    <div className="table-container">
      <h4 className="total-item">Total Orders : {meta.totalOrders}</h4>
      {/* Table */}
      <div>
        <Table>
          {/* head */}
          <thead>
            <tr id="field-title tex">
              <th className="text-center">Họ Tên</th>
              <th className="text-center">Địa chỉ</th>
              <th className="text-center">Số điện thoại</th>
              <th className="text-center">Tổng tiền</th>
              <th className="text-center">Ngày đặt</th>
              <th className="text-center">Tình trạng</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              const {
                customer_name,
                recipient_name,
                shipping_address,
                customer_phone,
                recipient_phone,
                total: cost,
                created_at,
                status,
              } = order

              const date = day(created_at).format('hh:mm a - MMM Do, YYYY ')

              return (
                <tr key={order.id} id={index}>
                  <td className="text-center">
                    {recipient_name || customer_name}
                  </td>
                  <td className="text-center">{shipping_address}</td>
                  <td className="text-center">
                    {recipient_phone || customer_phone}
                  </td>
                  <td className="text-center">{formatPrice(cost)}</td>
                  <td className="text-center">{date}</td>
                  <td className="text-center">
                    <Badge
                      pill
                      bg={
                        (status === 'pending' && 'warning') ||
                        (status === 'paid' && 'success') ||
                        (status === 'canceled' && 'danger')
                      }
                      text="dark"
                    >
                      {(status === 'pending' && 'Đang xử lý') ||
                        (status === 'paid' && 'Đã thanh toán') ||
                        (status === 'canceled' && 'Đã bị hủy')}
                    </Badge>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    </div>
  )
}
export default TotalOrdersList

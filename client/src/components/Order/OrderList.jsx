import day from 'dayjs'
import Table from 'react-bootstrap/Table'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import { primaryBgColor, quaternaryBgColor, tertiaryBgColor } from '../../assets/js/variables'
import { useEffect } from 'react'
import { formatPrice } from '../../utils'
import Badge from 'react-bootstrap/Badge'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import dateFormat from 'dateformat'
import { useSelector } from 'react-redux'
day.extend(advancedFormat)

const OrdersList = ({ orders, meta }) => {
  const user = useSelector((store) => store.user)
  const navigate = useNavigate()
  const handleNavigate = (id) => {
    navigate(`/order/${id}`)
  }

  const tr = document.getElementsByTagName('tr')
  useEffect(() => {
    Array.from(tr).forEach((row) => {
      if ((row.id).split('-')[1] === 'true') {
        Array.from(row.childNodes).forEach((child) => {
          child.style.backgroundColor = tertiaryBgColor
        })
      }
      else if (Number((row.id).split('-')[0]) % 2 === 0) {
        Array.from(row.childNodes).forEach((child) => {  
          child.style.backgroundColor = quaternaryBgColor
        })
      }
    })
  }, [orders])

  return (
    <Wrapper className="table-container">
      <h4 className="total-item">Đã đặt hàng : {meta.totalOrders}</h4>
      {/* Table */}
      <div>
        <Table>
          {/* head */}
          <thead>
            <tr id="field-title tex">
              <th className="text-center align-middle">Họ Tên</th>
              <th className="text-center align-middle">Địa chỉ</th>
              <th className="text-center align-middle">Số điện thoại</th>
              <th className="text-center align-middle">Tổng tiền</th>
              <th className="text-center align-middle">Ngày đặt</th>
              <th className="text-center align-middle">Tình trạng</th>
              <th className="text-center align-middle">Thanh toán</th>
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
                is_paid,
              } = order

              const date = dateFormat(created_at, 'dddd, dd mmmm, yyyy')

              return (
                <tr
                  key={order.id}
                  id={`${index}-${order.request_cancel}`}
                  onClick={() => handleNavigate(order.id)}
                >
                  <td className="text-center align-middle">
                    {recipient_name || customer_name}
                  </td>
                  <td className="text-center align-middle">
                    {shipping_address}
                  </td>
                  <td className="text-center align-middle">
                    {recipient_phone || customer_phone}
                  </td>
                  <td className="text-center align-middle">
                    {formatPrice(cost)}
                  </td>
                  <td className="text-center align-middle">{date}</td>
                  <td className="text-center align-middle">
                    <Badge
                      pill
                      bg={
                        (status !== 'đã hủy' && 'success') ||
                        (status === 'đã hủy' && 'danger')
                      }
                      text="dark"
                    >
                      {status}
                    </Badge>
                  </td>
                  <td
                    className="text-center align-middle"
                    style={{
                      color: `${is_paid ? 'green' : 'red'}`,
                      fontWeight: 'bold',
                    }}
                  >
                    {is_paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    </Wrapper>
  )
}
export default OrdersList

const Wrapper = styled.section`
  tr:hover {
    cursor: pointer;
  }
`

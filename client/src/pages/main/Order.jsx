import React from 'react'
import { PaginationContainer, SectionTitle } from '../../components'
import { OrdersList } from '../../components'
import { handleChange, getUserOrder } from '../../features/orders/orderSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { boldTextColor, primaryBgColor, quaternaryBgColor, quaternaryBgColorLight, shadow1 } from '../../assets/js/variables'
import styled from 'styled-components'
import Badge from 'react-bootstrap/Badge'


const Orders = () => {
  const { totalOrders, numOfPages, page, orders } = useSelector(
    (store) => store.order
  )
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getUserOrder())
  }, [page])

  const meta = { page, totalOrders, numOfPages }
  return (
    <Wrapper>
      <h1 className="heading">
        <Badge className="heading-badge">
          <span>Your Order</span>
        </Badge>
      </h1>
      <OrdersList meta={meta} orders={orders} />
      <PaginationContainer
        meta={meta}
        handleChange={handleChange}
        className="pagination"
      />
    </Wrapper>
  )
}

export default Orders

const Wrapper = styled.section`
  margin-top: 6rem;
  padding-bottom: 2rem;
  .table-container {
    padding: 0 6rem;
  }
  .table {
    box-shadow: ${shadow1};
  }
  th {
    background-color: ${quaternaryBgColorLight};
  }
  td {
    background-color: ${quaternaryBgColorLight};
    color: ${boldTextColor};
  }
  .pagination {
    margin-right: 3.5rem;
  }
  .total-item {
    font-weight: bold;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid ${boldTextColor};
    margin-bottom: 1rem;
  }
  .heading {
    font-size: 2.5rem;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.25rem;
    font-weight: bold;
    color: ${primaryBgColor};
  }
  .heading-badge {
    background-color: ${primaryBgColor} !important;
  }
  span {
    color: ${quaternaryBgColor};
  }
`

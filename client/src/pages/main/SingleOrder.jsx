import { useQuery } from '@tanstack/react-query'
import { customFetch } from '../../utils/axios'
import { useLoaderData } from 'react-router-dom'
import styled from 'styled-components'
import {
  CustomerContactInfo,
  OrderSummary,
  SectionTitle,
  ShippingAddress,
  OrderItemsList,
} from '../../components'

const getUserSingleOrder = (id) => {
  return {
    queryKey: ['userOrder', id || ''],
    queryFn: () => customFetch(`/orders/${id}`),
  }
}

export const loader =
  (queryClient) =>
  async ({ params }) => {
    const { id } = params
    const response = await queryClient.ensureQueryData(getUserSingleOrder(id))
    console.log(response)

    const order = response.data.order
    return { order }
  }

const SingleOrder = () => {
  const { order } = useLoaderData()

  return (
    <Wrapper>
      <SectionTitle text="Chi tiết đơn hàng" />
      <div className="container">
        {/* chia thành 12 cột */}
        <div className="row">
          {/* Item chiếm 8 cột */}
          <div className="col-8">
            <OrderItemsList itemList={order.book_list} />
          </div>
          {/* cart total chiếm 4 cột */}
          <div className="col-4">
            <div className="d-flex flex-column">
              {/* CustomerContactInfo */}
              <CustomerContactInfo />
              {/* ShippingAddress */}
              <ShippingAddress />
              {/* OrderSummary */}
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
export default SingleOrder

const Wrapper = styled.section`

`

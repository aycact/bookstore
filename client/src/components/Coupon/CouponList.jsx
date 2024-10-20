import styled from 'styled-components'
import { boldTextColor } from '../../assets/js/variables'
import CouponItems from './CouponItems'
import { PaginationContainer, Loading } from '../../components'
import { useDispatch } from 'react-redux'
import {
  getAllCoupons,
  handleChangeCouponFilter,
} from '../../features/coupon/couponSlice'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'

const CouponList = () => {
  const {publishers} = useLoaderData()
  const dispatch = useDispatch()
  const {
    coupons,
    isLoading,
    page,
    totalCoupons,
    numOfPages,
    search,
    status,
    applicable_publisher,
    sort,
  } = useSelector((store) => store.allCoupons)

  useEffect(() => {
    dispatch(getAllCoupons())
  }, [page, search, status, applicable_publisher, sort])

  const meta = { page, numOfPages, totalCoupons }

  if (isLoading) return <Loading />

  if (coupons.length === 0) {
    return (
      <Wrapper className="justify-content-center align-content-center">
        <h2 className="text-center fw-bold">No coupons to display...</h2>
      </Wrapper>
    )
  }

  return (
    <Wrapper className="table-container">
      <div className="total-item">
        <h4>Số lượng : {meta.totalCoupons}</h4>
      </div>
      <section className="coupon-items">
        {coupons.map((coupon) => {
          return (
            <CouponItems
              key={coupon.id}
              coupon={coupon}
              publishers={publishers}
            />
          )
        })}
      </section>
      <PaginationContainer
        meta={meta}
        handleChange={handleChangeCouponFilter}
        pagingFor={'coupon'}
      />
    </Wrapper>
  )
}
export default CouponList

const Wrapper = styled.section`
  padding: 0 6rem;
  flex-grow: 1;
  .table-container {
  }
  .total-item {
    font-weight: bold;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid ${boldTextColor};
    margin-bottom: 1rem;
  }
  .coupon-items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }
`

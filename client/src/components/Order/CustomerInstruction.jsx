import React from 'react'
import styled from 'styled-components'
import { shadow1 } from '../../assets/js/variables'

const CustomerInstruction = ({ paymentMethod, coupon, instruction }) => {
  return (
    <Wrapper>
      <h5>Thông tin thêm</h5>
      <div className="p-line">
        <span className="fw-bold">Thanh toán: </span>
        {paymentMethod}
      </div>
      <div className="p-line">
        <span className="fw-bold">Mã giảm giá: </span>
        {coupon || 'Không có mã giảm giá'}
      </div>
      <div className="p-line">
        <span className="fw-bold">Ghi chú: </span>
        {instruction || 'Không có yêu cầu nào'}
      </div>
    </Wrapper>
  )
}

export default CustomerInstruction

const Wrapper = styled.section`
  margin-bottom: 1rem;
  box-shadow: ${shadow1};
  padding: 1rem;
  background-color: white;
  border-radius: 1rem;
  .icon {
    font-size: 1.5rem;
  }
  .p-line {
    padding-top: 0.8rem;
    color: #000;
    border-bottom: 0.5px solid gray;
  }
`

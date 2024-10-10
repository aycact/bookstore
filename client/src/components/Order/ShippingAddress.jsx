import styled from 'styled-components'
import {
  MdOutlineLocationOn,
  MdOutlinePersonOutline,
  MdOutlinePhoneAndroid,
} from 'react-icons/md'
import { shadow1 } from '../../assets/js/variables'

const ShippingAddress = ({orderInfo}) => {
  return (
    <Wrapper>
      <h5>Thông tin nhận hàng</h5>
      <div className="p-line">
        <span className="icon">
          <MdOutlinePersonOutline />
        </span>{' '}
        {orderInfo.recipient_name}
      </div>
      <div className="p-line">
        <span className="icon">
          <MdOutlinePhoneAndroid />
        </span>{' '}
        {orderInfo.recipient_phone}
      </div>
      <div className="p-line">
        <span className="icon">
          <MdOutlineLocationOn />
        </span>{' '}
        {orderInfo.shipping_address}
      </div>
    </Wrapper>
  )
}
export default ShippingAddress

const Wrapper = styled.section`
  color: #000;
  margin-bottom: 1rem;
  box-shadow: ${shadow1};
  padding: 1rem;
  background-color: white;
  border-radius: 1rem;
  .icon {
    font-size: 1.5rem;
  }
  .p-line {
    border-bottom: 0.5px solid gray;
  }
`

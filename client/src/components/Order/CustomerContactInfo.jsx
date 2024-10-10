import styled from 'styled-components'
import {
  MdOutlinePersonOutline,
  MdMailOutline,
  MdOutlinePhoneAndroid,
} from 'react-icons/md'
import { quaternaryBgColor, shadow1 } from '../../assets/js/variables'
import UserInfo from '../../pages/main/UserInfo'

const CustomerContactInfo = ({userInfo}) => {
  return (
    <Wrapper>
      <h5>Thông tin khách hàng</h5>
      <div className="p-line">
        <span className="icon">
          <MdOutlinePersonOutline />
        </span>{' '}
        {userInfo.name}
      </div>
      <div className="p-line">
        <span className="icon">
          <MdMailOutline />
        </span>{' '}
        {userInfo.email}
      </div>
      <div className="p-line">
        <span className="icon">
          <MdOutlinePhoneAndroid />
        </span>{' '}
        {userInfo.phone_number}
      </div>
    </Wrapper>
  )
}
export default CustomerContactInfo

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

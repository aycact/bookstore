import styled from 'styled-components'
import {
  secondaryBgColor,
  primaryBgColor,
  quaternaryBgColor,
  tertiaryBgColor,
  boldTextColor,
  textColor,
  tertiaryBgColorHover,
} from '../../assets/js/variables'
import { NavLink } from 'react-router-dom'
import { GiPaperTray } from 'react-icons/gi'
import { IoIosCreate } from 'react-icons/io'
import { BiSolidCoupon } from 'react-icons/bi'
import { MdClass } from 'react-icons/md'

const ManageSidebar = () => {
  return (
    <Wrapper>
      <section className="sidebar" id="mySidebar">
        <div className="container">
          <NavLink className="nav-link" to="/manager">
            <i className="icon">
              <IoIosCreate />
            </i>
            Thêm mới
          </NavLink>
          <NavLink className="nav-link" to="/manager/coupon">
            <i className="icon">
              <MdClass />
            </i>
            Phân loại sách
          </NavLink>
          <NavLink className="nav-link" to="/manager/coupon">
            <i className="icon">
              <BiSolidCoupon />
            </i>
            Quản lý mã giảm giá
          </NavLink>
          <NavLink className="nav-link" to="/manager/order">
            <i className="icon">
              <GiPaperTray />
            </i>
            Quản lý đơn hàng
          </NavLink>
        </div>
      </section>
    </Wrapper>
  )
}
export default ManageSidebar

const Wrapper = styled.section`
  .container {
    margin-top: 3rem;
    padding: 0;
  }
  .sidebar {
    z-index: 2;
    position: fixed;
    left: -250px;
    top: 0;
    width: 250px;
    height: 100%;
    background-color: ${tertiaryBgColor};
    color: white;
    transition: left 0.3s ease;
    padding: 20px 0;
  }
  .sidebar.active {
    left: 0;
  }

  .nav-link {
    display: flex;
    padding-left: 1rem;
    color: ${textColor};
    margin: 0;
    border-radius: 10px;
    text-decoration: none;
    font-weight: bold;
    font-size: 1rem;
    text-align: middle;
    line-height: 3rem;
  }
  .nav-link:hover {
    border-radius: 0;
    background-color: ${tertiaryBgColorHover};
  }
  a {
    text-decoration: none;
  }
  .icon {
    margin-right: 0.5rem;
    font-size: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${primaryBgColor};
  }
`

import React from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { logo } from '../assets/images'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import styled from 'styled-components'
import {
  primaryBgColorHover,
  primaryBgColor,
  shadow4,
  secondaryBgColor,
  tertiaryBgColor,
  quaternaryBgColor,
  quaternaryBgColorHover,
} from '../assets/js/variables'

import { logoutUser } from '../features/users/userSlice'
import { clearCart } from '../features/cart/cartSlice'

const MyNavbar = () => {
  const { user } = useSelector((store) => store.user)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  const handleLogout = () => {
    navigate('/')
    dispatch(clearCart())
    dispatch(logoutUser())
    queryClient.removeQueries()
  }
  return (
    <Wrapper>
      <Navbar expand="lg" className="navbar-custom position-fixed">
        <Container className="position-relative">
          <Navbar.Brand
            href="#home"
            className="py-0"
            style={{ height: '30px', width: '120px' }}
          >
            <img
              src={logo}
              height="100%"
              className="d-inline-block position-absolute top-0 start-20"
              alt="book app logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
              <Nav.Link href="/">Trang chủ</Nav.Link>
              <Nav.Link href="/about">Thông tin</Nav.Link>
              <Nav.Link href="/library">Kho sách</Nav.Link>
              {(user === null || user?.role === 'user') && (
                <Nav.Link href="/cart">Giỏ hàng</Nav.Link>
              )}
              {user && user?.role === 'user' && (
                <Nav.Link href="/checkout">Thanh toán</Nav.Link>
              )}
              {user && <Nav.Link href="/order">Đơn hàng</Nav.Link>}
              {user && user?.role === 'admin' && (
                <Nav.Link href="/manager">Quản lý</Nav.Link>
              )}
            </Nav>
            {user ? (
              <Navbar.Text>
                <a href="/user">{user.name}</a>
                <button onClick={handleLogout} className="auth-btn">
                  Đăng xuất
                </button>
              </Navbar.Text>
            ) : (
              <button className="auth-btn">
                <Link to="/register">Đăng nhập / Đăng xuất</Link>
              </button>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Wrapper>
  )
}

export default MyNavbar

const Wrapper = styled.section`
  .navbar-custom {
    font-weight: 600;
    background-color: ${primaryBgColor}; /* Màu nền tùy chỉnh */
    box-shadow: ${shadow4};
    top: 0;
    width: 100vw;
    z-index: 10;
  }
  .navbar-custom .nav-link {
    color: ${secondaryBgColor};
    margin: 0;
    border-radius: 10px;
  }
  .navbar-custom .nav-link:hover {
    background-color: ${primaryBgColorHover}; /* Thay đổi màu khi hover */
    color: ${tertiaryBgColor};
  }
  .navbar-custom .nav-link:focus,
  .navbar-custom .nav-link:active {
    background-color: ${primaryBgColorHover}; /* Thay đổi màu khi focus hoặc active */
    color: ${tertiaryBgColor};
  }
  .navbar-custom .nav-link.active {
    color: ${secondaryBgColor};
  }
  .navbar-custom .nav-link.show {
    color: ${secondaryBgColor};
  }
  .navbar-custom .dropdown-menu {
    background-color: ${quaternaryBgColor};
  }
  .navbar-custom .dropdown-menu .dropdown-item {
    background-color: ${quaternaryBgColor};
  }
  .navbar-custom .dropdown-menu .dropdown-item:hover {
    background-color: ${quaternaryBgColorHover}; /* Thay đổi màu khi hover */
  }
  .navbar-text {
    color: ${secondaryBgColor};
  }
  a {
    color: ${secondaryBgColor};
  }
  .auth-btn {
    border-radius: 0.5rem;
    margin-left: 1rem;
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: bold;
    color: ${secondaryBgColor};
    background-color: ${primaryBgColor};
    border-color: ${secondaryBgColor};
  }
  a {
    text-decoration: none;
  }
`

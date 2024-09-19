import React from 'react'
import { customFetch } from '../utils/axios'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import { useLoaderData } from 'react-router-dom'
import styled from 'styled-components'
import {
  primaryBgColor,
  quaternaryBgColor,
  primaryBgColorHover,
} from '../assets/js/variables'
import Button from 'react-bootstrap/esm/Button'

export const loader = async ({ request }) => {
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ])
  const data = {
    email: params.email,
    verificationToken: params.token,
  }
  try {
    const response = await customFetch.post('/auth/verify-email', data)
    return response.data.msg
  } catch (error) {
    const message = error.response?.data?.msg || 'verify email error'
    return message
  }
}

const VerifyEmail = () => {
  const msg = useLoaderData()
  return (
    <Wrapper>
      <Navbar expand="lg" className="navbar">
        <Container>
          <Navbar.Brand href="#verifyEmail">Verify Email</Navbar.Brand>
          <Nav.Link href="/register">Login</Nav.Link>
        </Container>
      </Navbar>
      <div className="msg-box">
        <h5>{msg}</h5>
      </div>
    </Wrapper>
  )
}

export default VerifyEmail

const Wrapper = styled.section`
  .navbar {
    background-color: ${primaryBgColor};
    font-weight: bold;
  }
  .navbar-brand {
    color: ${quaternaryBgColor};
  }
  .nav-link {
    color: ${quaternaryBgColor};
  }
  .msg-box {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    color: ${primaryBgColorHover};
    padding: 2rem;
    text-align: center;
  }
  h5 {
    text-transform: capitalize;
    font-size: 3rem;
  }
`

import { useState } from 'react'
import { FormInput } from '../components'
import styled from 'styled-components'
import Button from 'react-bootstrap/Button'
import {
  primaryBgColor,
  quaternaryBgColor,
  quaternaryBgColorLight,
  primaryBgColorHover,
  shadow1,
} from '../assets/js/variables'
import { toast } from 'react-toastify'
import { Form } from 'react-router-dom'
import { customFetch } from '../utils/axios'
import { redirect } from 'react-router-dom'

export const action = async ({ request }) => {
  console.log(request.url)

  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ])
  console.log(params)

  const dataForm = await request.formData()
  const data = Object.fromEntries(dataForm)
  const body = { ...params, ...data }
  try {
    await customFetch.post('/auth/reset-password', body)
    toast.success('Đổi mật khẩu thành công!')
    return redirect('/register')
  } catch (error) {
    console.log(error)
  }
}

function ForgotPass() {
  const [password, setPassword] = useState('')
  const handleChange = (e) => {
    setPassword(e.target.value)
  }
  return (
    <Wrapper className="full-page">
      <Form className="form" method="POST">
        <h3>Nhập mật khẩu mới</h3>
        {/* password field */}
        <FormInput
          placeholder={'Nhập mật khẩu mới của bạn'}
          label="Mật khẩu"
          type="password"
          name="password"
          value={password}
          handleChange={handleChange}
        />
        <div className="btn-container">
          <button type="submit" className="btn">
            Xác nhận
          </button>
        </div>
      </Form>
    </Wrapper>
  )
}
export default ForgotPass

const Wrapper = styled.section`
  height: 100vh;
  display: grid;
  align-items: center;
  justify-content: center;
  .logo {
    display: block;
    margin: 0 auto;
    margin-bottom: 1.38rem;
  }
  .form {
    box-shadow: ${shadow1};
    border-radius: 1rem;
    width: 40vw;
    padding: 2rem 3.5rem;
    background-color: ${quaternaryBgColorLight};
    max-width: 400px;
    border-top: 5px solid ${primaryBgColor};
  }

  h3 {
    text-align: center;
    font-weight: bold;
  }
  p {
    margin: 0;
    margin-top: 1rem;
    text-align: center;
  }
  .btn {
    color: ${quaternaryBgColor};
    font-weight: bold;
    background-color: ${primaryBgColor};
    border-color: ${primaryBgColorHover};
  }
  .btn:active {
    background-color: ${quaternaryBgColor};
    color: ${primaryBgColor};
  }
  .member-btn {
    margin-bottom: 5px;
    background: transparent;
    border: transparent;
    color: ${primaryBgColor};
    cursor: pointer;
    /* letter-spacing: var(--letterSpacing); */
  }
  .btn-container {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    gap: 2rem;
  }

  .gender-container {
    gap: 1rem;
    display: flex;
    flex-direction: row;
  }
  .radio-label {
    font-size: 1rem;
    font-weight: normal;
  }
`

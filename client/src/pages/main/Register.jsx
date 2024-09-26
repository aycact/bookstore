import { useState, useEffect } from 'react'
import { FormInput, RadiosInput } from '../../components/index'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, registerUser } from '../../features/users/userSlice'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Button from 'react-bootstrap/Button'
import {
  primaryBgColor,
  quaternaryBgColor,
  quaternaryBgColorLight,
  primaryBgColorHover,
  shadow1,
} from '../../assets/js/variables'

const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true,
  gender: 'Nam'
}

function Register() {
  const [values, setValues] = useState(initialState)
  const { user, isLoading } = useSelector((store) => store.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const radios = document.getElementsByName('gender')
    radios.forEach((radio) => {
      if (radio.value === values.gender) {
        radio.checked = true
      }
    })
  }, [values.isMember, values.gender])

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value

    setValues({ ...values, [name]: value })
  }
  const onSubmit = (e) => {
    e.preventDefault()
    const { name, email, password, isMember, gender } = values
    console.log(values);
    
    if (!email || !password || (!isMember && !name)) {
      toast.error('Please fill out all fields')
      return
    }
    if (isMember) {
      dispatch(loginUser({ email: email, password: password }))
      return
    }
    dispatch(registerUser({ name, email, password, gender }))
  }

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember })
  }
  useEffect(() => {
    if (user) {
      console.log(user)
      setTimeout(() => {
        navigate('/')
      }, 2000)
    }
  }, [user])
  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <h3>{values.isMember ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ'}</h3>
        {/* name field */}
        {!values.isMember && (
          <FormInput
            label="Họ tên"
            type="text"
            name="name"
            value={values.name}
            handleChange={handleChange}
          />
        )}
        {/* gender field */}
        {!values.isMember && (
          <div className="mb-2">
            <h5 className="radio-label">Giới tính</h5>
            <div className="gender-container">
              {['Nam', 'Nữ', 'Khác'].map((gender) => {
                return (
                  <RadiosInput
                    key={gender}
                    name="gender"
                    value={gender}
                    label={gender}
                    handleCheck={handleChange}
                  />
                )
              })}
            </div>
          </div>
        )}
        {/* email field */}
        <FormInput
          label="Email"
          type="email"
          name="email"
          value={values.email}
          handleChange={handleChange}
        />
        {/* password field */}
        <FormInput
          label="Mật khẩu"
          type="password"
          name="password"
          value={values.password}
          handleChange={handleChange}
        />
        <div className="btn-container">
          <Button type="submit" className="btn" disabled={isLoading}>
            {isLoading
              ? 'loading...'
              : values.isMember
              ? 'Đăng nhập'
              : 'Đăng ký'}
          </Button>
          <Button
            className="btn"
            disabled={isLoading}
            onClick={() =>
              dispatch(
                loginUser({ email: 'testUser@test.com', password: 'secret' })
              )
            }
          >
            {isLoading ? 'loading...' : 'demo app'}
          </Button>
        </div>
        <p>
          {values.isMember ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
          <Button onClick={toggleMember} className="member-btn">
            {values.isMember ? 'Đăng ký' : 'Đăng nhập'}
          </Button>
        </p>
      </form>
    </Wrapper>
  )
}
export default Register

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

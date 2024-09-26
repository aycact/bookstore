import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { FormInput, RadiosInput, FileInput, Loading } from '../../components'
import {
  textColor,
  quaternaryBgColorLight,
  shadow1,
} from '../../assets/js/variables'

import {
  primaryBgColorHover,
  quaternaryBgColor,
} from '../../assets/js/variables'
import { useSelector, useDispatch } from 'react-redux'
import { updateUser } from '../../features/users/userSlice'
import { defaultAvatar } from '../../assets/images'

const UserInfo = () => {
  const dispatch = useDispatch()
  const [preview, setPreview] = useState(null)
  const { user, isLoading } = useSelector((store) => store.user)

  const [values, setValues] = useState({
    name: user?.name,
    phone_number: user?.phoneNumber || '',
    gender: user?.gender,
    address: user?.address || '',
    user_img: null
  })

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setValues({ ...values, [name]: value })
  }

  const handleImgUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      values.user_img = file
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    const radios = document.getElementsByName('gender')
    radios.forEach((radio) => {
      if (radio.value === user.gender) {
        radio.checked = true
      }
    })
  }, [isLoading])
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(values)
    dispatch(updateUser({ ...values, id: user.id }))
  }
  if(isLoading) {
    return <Loading/>
  }

  return (
    <Wrapper>
      <div className="info-heading">
        <h2>Your Info</h2>
      </div>
      <div className="container">
        <section className="row">
          <div className="col img-container mb-5 d-flex flex-column">
            <img src={preview || user.user_img || defaultAvatar} alt="user image" className="user-img" />

            <FileInput
              label="Tải ảnh"
              name="user_img"
              handleChange={handleImgUpload}
            />
          </div>
          <form className="form col">
            <div className="row mb-2">
              {/* name field */}
              <div className="col">
                <FormInput
                  label="Họ Tên"
                  type="text"
                  name="name"
                  value={values.name}
                  handleChange={handleChange}
                />
              </div>

              {/* phone number field */}
              <div className="col">
                <FormInput
                  label="SĐT"
                  type="text"
                  name="phone_number"
                  value={values.phone_number}
                  handleChange={handleChange}
                />
              </div>
            </div>
            {/* gender field */}
            <div className="mb-2">
              <h5 className="radio-label">Giới tính:</h5>
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
            {/* address field */}
            <div className="mb-2">
              <FormInput
                label="Địa chỉ"
                type="text"
                name="address"
                value={values.address}
                handleChange={handleChange}
              />
            </div>
            <div className="btn-container">
              <button onClick={handleSubmit} className="btn">
                Cập nhật thông tin
              </button>
            </div>
          </form>
        </section>
      </div>
    </Wrapper>
  )
}

export default UserInfo

const Wrapper = styled.section`
  margin-top: 6rem;
  .form {
    padding: 0 6rem;
  }
  .info-heading {
    width: 100%;
    background-color: ${primaryBgColorHover};
    padding: 0.75rem 0;
  }
  h2 {
    color: ${quaternaryBgColor};
    font-weight: bold;
    margin: 0 0 0 5rem;
  }
  .img-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0rem 2rem;
  }
  .user-img {
    padding: 0 2rem;
    border-radius: 5rem;
    width: 20rem;
    height: 20rem;
    object-fit: cover;
  }
  .gender-container {
    gap: 1rem;
    display: flex;
    flex-direction: row;
  }
  h5 {
    font-size: 1rem;
  }
  .container {
    padding: 2rem 0;
  }
  .btn {
    margin-top: 1rem;
    color: ${textColor};
    cursor: pointer;
    background-color: ${quaternaryBgColorLight};
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    box-shadow: ${shadow1};
    font-weight: 600;
    text-transform: uppercase;
  }
`

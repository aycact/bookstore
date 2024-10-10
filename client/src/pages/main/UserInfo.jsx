import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { FormInput, RadiosInput, FileInput, Loading } from '../../components'
import { useDispatch } from 'react-redux'
import { updateUser } from '../../features/users/userSlice'
import { defaultAvatar } from '../../assets/images'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import { toast } from 'react-toastify'
import { customFetch } from '../../utils/axios'
import { clearStore } from '../../features/users/userSlice'

import {
  textColor,
  quaternaryBgColorLight,
  shadow1,
} from '../../assets/js/variables'

import {
  primaryBgColorHover,
  quaternaryBgColor,
} from '../../assets/js/variables'
import { useQuery } from '@tanstack/react-query'

const showCurrentUser = () => {
  const {
    isLoading,
    data: userData,
    error,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['showMe'],
    queryFn: async () => {
      const response = await customFetch(`/users/showMe`) // đảm bảo sử dụng await đúng cách
      return response.data // trả về dữ liệu cần thiết
    },
  })

  return { isLoading, userData, error, isError, refetch }
}

const UserInfo = () => {
  const { isLoading, userData, error, isError, refetch } = showCurrentUser()

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [showVerifyId, setShowVerifyId] = useState(false)
  const handleShowModal = () => setShowVerifyId(true)
  const handleCloseModal = () => setShowVerifyId(false)

  const [preview, setPreview] = useState(null)

  const [values, setValues] = useState({
    name: userData?.name,
    phone_number: userData?.phoneNumber || '',
    gender: userData?.gender,
    address: userData?.address || '',
    user_img: null,
    cccd: '',
    cccd_img: null,
  })

  useEffect(() => {
    if (userData) {
      setValues({
        name: userData.name,
        phone_number: userData.phone_number || '',
        gender: userData.gender,
        address: userData.address || '',
        user_img: userData?.user_img,
        cccd: '',
        cccd_img: null,
      })
    }
  }, [userData])

  const handleSubmitCCCD = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('cccd', values.cccd)
      formData.append('cccd_img', values.cccd_img)
      await customFetch.patch('/users/updateUserIdCard', formData)
      toast.success('Cập nhật thông tin thành công')
      setValues({ ...values, cccd: '', cccd_img: null })
      handleCloseModal()
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.msg)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setValues({ ...values, [name]: value })
  }

  const handleCardImgUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      values.cccd_img = file
    }
  }

  const handleUserImgUpload = (e) => {
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
    refetch()
  }, [loading, refetch])
  useEffect(() => {
    if (userData) {
      const radios = document.getElementsByName('gender')
      radios.forEach((radio) => {
        if (radio.value === userData.gender) {
          radio.checked = true
        }
      })
    }
  }, [userData])
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(values)
    dispatch(updateUser({ ...values, id: userData.id }))
  }
  if (loading) {
    return <Loading />
  }
  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    if (error?.response?.status === 401) {
      dispatch(clearStore())
      return
    }
    return <p style={{ marginTop: '1rem' }}>{error.message}</p>
  }

  return (
    <Wrapper>
      <Modal show={showVerifyId} onHide={handleCloseModal}>
        <Modal.Header
          closeButton
          style={{ backgroundColor: `${quaternaryBgColor}` }}
        >
          <Modal.Title>Xác thực danh tính</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: `${quaternaryBgColor}` }}>
          <Form>
            <FormInput
              label="Nhập số CCCD"
              type="text"
              name="cccd"
              value={values.cccd}
              handleChange={handleChange}
            />

            <FileInput
              label="Tải ảnh mặt trước CCCD"
              name="cccd_img"
              handleChange={handleCardImgUpload}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: `${quaternaryBgColor}` }}>
          <div className="btn-container">
            <button
              disabled={loading}
              type="button"
              onClick={handleCloseModal}
              style={{ backgroundColor: `${quaternaryBgColorLight}` }}
              className="btn"
            >
              {loading ? 'Đang xử lý...' : 'Đóng'}
            </button>
            <button
              disabled={loading}
              type="button"
              onClick={handleSubmitCCCD}
              style={{ backgroundColor: `${quaternaryBgColorLight}` }}
              className="btn ms-2"
            >
              {loading ? 'Đang xử lý...' : 'Cập nhật thông tin'}
            </button>
          </div>
        </Modal.Footer>
      </Modal>

      <div className="info-heading">
        <h2>Thông tin của bạn</h2>
      </div>
      <div className="container">
        <section className="row">
          <div className="col img-container mb-5 d-flex flex-column">
            <img
              src={preview || userData?.user_img || defaultAvatar}
              alt="user image"
              className="user-img"
            />

            <FileInput
              label="Tải ảnh"
              name="user_img"
              handleChange={handleUserImgUpload}
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
              <button type="button" onClick={handleSubmit} className="btn">
                Cập nhật thông tin
              </button>
              <button type="button" onClick={handleShowModal} className="btn">
                Xác thực danh tính
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
  .btn-container {
    display: flex;
    justify-content: flex-start;
    gap: 1rem;
  }
`

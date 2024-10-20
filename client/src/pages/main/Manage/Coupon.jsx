import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MdPostAdd } from 'react-icons/md'
import { Button, Modal } from 'react-bootstrap'
import dayjs from 'dayjs'
import { getCurrentDateTime } from '../../../utils'
import styled from 'styled-components'
import {
  quaternaryBgColor,
  quaternaryBgColorLight,
  shadow1,
  primaryBgColor,
} from '../../../assets/js/variables'
import {
  FormInput,
  FileInput,
  CouponList,
  DateInput,
  SelectInput,
  CheckboxInput,
  RadiosInput,
  Loading,
  CouponFilter,
} from '../../../components'
import { customFetch } from '../../../utils/axios'
import { Form, useLoaderData } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { addCoupon, getAllCoupons } from '../../../features/coupon/couponSlice'

const fetchPublishers = () => {
  return {
    queryKey: ['publishers'],
    queryFn:  () => customFetch.get('/publishers')
  }
}

const initialValues = {
  code: '',
  description: '',
  discount_type: 'percentage',
  discount_amount: 0,
  discount_percentage: 0,
  min_order_value: 0,
  start_date: dayjs(getCurrentDateTime()),
  expiration_date: dayjs(getCurrentDateTime()),
  usage_limit: 0,
  limit_per_customer: 0,
  stackable: false,
  applicable_publisher: '',
}

export const loader = (queryClient) => async () => {
  const response = await queryClient.fetchQuery(fetchPublishers())
  
  const publishers = response?.data?.publishers || []
  return {publishers}
}

const Coupon = () => {
  const {publishers} = useLoaderData()
  console.log(publishers)
  const dispatch = useDispatch()
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showCouponModal, setShowCouponModal] = useState(false)
  const handleShowModal = () => setShowCouponModal(true)
  const handleCloseModal = () => setShowCouponModal(false)
  const [values, setValues] = useState(initialValues)


  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
    }

    setValidated(true)

    try {
      setLoading(true)
      if (dayjs(values.start_date).isAfter(dayjs(values.expiration_date))) {
        toast.error('Ngày hiệu lực phải nhỏ hơn ngày hết hạn')
        setLoading(false)
        return
      }
      dispatch(addCoupon(values))
      setLoading(false)
      setValues({ ...initialValues })
    } catch (error) {
      console.log(error)
    } finally {
      dispatch(getAllCoupons())
    }
  }

  const handleStartDateChange = (e) => {
    setValues({
      ...values,
      start_date: e,
    })
  }
  const handleExpirationDateChange = (e) => {
    setValues({
      ...values,
      expiration_date: e,
    })
  }
  const handleCheck = (e) => {
    setValues({ ...values, stackable: !values.stackable })
  }

  if (loading) return <Loading />

  return (
    <Wrapper>
      <button
        type="button"
        className="add-coupon-button"
        onClick={handleShowModal}
      >
        <MdPostAdd />
      </button>
      <Modal show={showCouponModal} onHide={handleCloseModal}>
        <Modal.Header
          closeButton
          style={{ backgroundColor: `${quaternaryBgColor}` }}
        >
          <Modal.Title>Tạo mã giảm giá</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: `${quaternaryBgColor}` }}>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <div className="row">
              <div className="col">
                <FormInput
                  label="Mã giảm giá"
                  type="text"
                  name="code"
                  value={values.code}
                  handleChange={handleChange}
                  isInvalid={validated && !values.code}
                  required
                />
              </div>
              <div className="col">
                <div>Loại giảm giá</div>
                {['percentage', 'fixed_amount'].map((type) => {
                  return (
                    <div className="ms-2" key={type}>
                      <RadiosInput
                        key={type}
                        name="discount_type"
                        value={type}
                        label={type === 'percentage' ? 'Phần trăm' : 'Số tiền'}
                        handleCheck={handleChange}
                        checked={values.discount_type === type}
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            <FormInput
              label="Nhập mô tả mã giảm giá"
              type="text"
              name="description"
              value={values.description}
              handleChange={handleChange}
              isInvalid={validated && !values.description}
              required
            />
            <div className="row">
              <div className="col">
                {values.discount_type === 'percentage' ? (
                  <FormInput
                    label="Phần trăm"
                    type="number"
                    name="discount_percentage"
                    value={values.discount_percentage}
                    handleChange={handleChange}
                  />
                ) : (
                  <FormInput
                    label="Số tiền"
                    type="number"
                    name="discount_amount"
                    value={values.discount_amount}
                    handleChange={handleChange}
                  />
                )}
              </div>
              <div className="col">
                <FormInput
                  label="Áp dụng cho giá trị từ"
                  type="number"
                  name="min_order_value"
                  value={values.min_order_value}
                  handleChange={handleChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <DateInput
                  label="Ngày hiệu lực"
                  name="start_date"
                  value={dayjs(values.start_date)}
                  handleChange={handleStartDateChange}
                />
              </div>
              <div className="col">
                <DateInput
                  label="Ngày hết hạn"
                  name="expiration_date"
                  value={dayjs(values.expiration_date)}
                  handleChange={handleExpirationDateChange}
                />
              </div>
            </div>

            <div className="row mt-2">
              <div className="col">
                <FormInput
                  label="Tổng số lần sử dụng"
                  type="number"
                  name="usage_limit"
                  value={values.usage_limit}
                  handleChange={handleChange}
                />
              </div>
              <div className="col">
                <FormInput
                  label="Số lần sử dụng / khách hàng"
                  type="number"
                  name="limit_per_customer"
                  value={values.limit_per_customer}
                  handleChange={handleChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <SelectInput
                  defaultValue="all"
                  label="Nhà xuất bản"
                  name="applicable_publisher"
                  list={publishers}
                  value={values.applicable_publisher}
                  handleChoose={handleChange}
                />
              </div>
              <div className="col mt-4">
                <CheckboxInput
                  label="Dùng với mã khác"
                  name="stackable"
                  value={values.stackable}
                  handleChange={handleCheck}
                />
              </div>
            </div>
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
                type="submit"
                style={{ backgroundColor: `${quaternaryBgColorLight}` }}
                className="btn ms-2"
              >
                {loading ? 'Đang xử lý...' : 'Thêm mã giảm giá'}
              </button>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer
          style={{ backgroundColor: `${quaternaryBgColor}` }}
        ></Modal.Footer>
      </Modal>
      <div className="coupon-container d-flex flex-row">
        <CouponFilter  />
        <CouponList />
      </div>
    </Wrapper>
  )
}

export default Coupon

const Wrapper = styled.section`
  width: 100vw;
  margin-top: 6rem;
  padding-bottom: 2rem;
  min-height: 100vh;
  .coupon-container {
    width: 100%;
  }
  .add-coupon-button {
    float: right;
    background-color: ${quaternaryBgColorLight};
    margin-top: -2rem;
    margin-right: 2rem;
    padding: 0.75rem;
    border-radius: 50%;
    font-size: 1.75rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: sticky;
    top: 5rem;
    right: 1rem;
    color: ${primaryBgColor};
    border-color: transparent;
    box-shadow: ${shadow1};
    font-weight: bold;
    transition: all 0.3s linear;
    z-index: 2;
  }
  .select-label {
    font-size: 1rem;
    font-weight: normal;
  }

  .select-input {
    margin-bottom: 0rem;
  }
`

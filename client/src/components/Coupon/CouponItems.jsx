import React, { useState } from 'react'
import { Card, Button, Row, Col, Modal, Form } from 'react-bootstrap'
import styled from 'styled-components'
import {
  boldTextColor,
  quaternaryBgColor,
  quaternaryBgColorLight,
  textColor,
  shadow1,
} from '../../assets/js/variables'
import { TbCalendarTime } from 'react-icons/tb'
import { FaRegCalendarTimes } from 'react-icons/fa'
import { FaBuilding } from 'react-icons/fa'
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
} from '../../components'
import dayjs from 'dayjs'
import { getCurrentDateTime } from '../../utils'
import { customFetch } from '../../utils/axios'
import { toast } from 'react-toastify'

const CouponItems = ({ coupon, publishers }) => {
  const [showCouponModal, setShowCouponModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleShowModal = () => setShowCouponModal(true)
  const handleCloseModal = () => setShowCouponModal(false)
  const [values, setValues] = useState({
    code: coupon?.code || '',
    description: coupon?.description || '',
    discount_type: coupon?.discount_type || 'percentage',
    discount_amount: coupon?.discount_amount || 0,
    discount_percentage: coupon?.discount_percentage || 0,
    min_order_value: coupon?.min_order_value || 0,
    start_date: dayjs(coupon?.start_date) || dayjs(getCurrentDateTime()),
    expiration_date:
      dayjs(coupon?.expiration_date) || dayjs(getCurrentDateTime()),
    usage_limit: coupon?.usage_limit || 0,
    limit_per_customer: coupon?.limit_per_customer || 0,
    stackable: coupon?.stackable || false,
    applicable_publisher: coupon?.applicable_publisher || '',
  })

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setValues({ ...values, [name]: value })
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const startDate = dayjs(values.start_date).format('MM/DD/YYYY')
    const expirationDate = dayjs(values.expiration_date).format('MM/DD/YYYY')
    try {
      setLoading(true)
      await customFetch.patch(`/coupons/${coupon.id}`, {
        ...values,
        start_date: startDate,
        expiration_date: expirationDate,
      })
      toast.success('Cập mã giảm giá thành công')
      handleCloseModal()
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.msg)
    } finally {
      setLoading(false)
    }
  }
  return (
    <StyledCard>
      {/* Mã giảm giá */}
      <Card className="p-3 shadow-sm">
        <Row>
          <Col md={10}>
            <Card.Body>
              <Card.Title className="mb-0">{coupon.code}</Card.Title>
              <Card.Subtitle className="mb-3 text-muted">
                {coupon.description}
              </Card.Subtitle>

              <Row className="mb-2">
                <Col xs={6} className="d-flex align-items-center">
                  <i>
                    <TbCalendarTime />
                  </i>{' '}
                  {coupon.start_date}
                </Col>

                <Col xs={6} className="d-flex align-items-center">
                  <i>
                    <FaRegCalendarTimes />
                  </i>{' '}
                  {coupon.expiration_date}
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xs={6} className="d-flex align-items-center">
                  <i>
                    {' '}
                    <FaBuilding />
                  </i>{' '}
                  {coupon?.publisher?.name}
                </Col>
                {/* Trạng thái */}
                <Col xs={6}>
                  <span
                    className={`badge ${
                      coupon.status === 'active' ? 'bg-success' : 'bg-danger'
                    } p-2 status-badge`}
                  >
                    {coupon.status}
                  </span>
                </Col>
              </Row>

              <div className="d-flex justify-content-start">
                <button className="me-2 btn" onClick={handleShowModal}>
                  Edit
                </button>
                <Button variant="danger">Delete</Button>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>

      {/* Xử lý cập nhật mã giảm giá */}
      <Modal show={showCouponModal} onHide={handleCloseModal}>
        <Form method="post">
          <Modal.Header
            closeButton
            style={{ backgroundColor: `${quaternaryBgColor}` }}
          >
            <Modal.Title>Tạo mã giảm giá</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: `${quaternaryBgColor}` }}>
            <div className="row">
              <div className="col">
                <FormInput
                  label="Nhập mã giảm giá"
                  type="text"
                  name="code"
                  value={values.code}
                  handleChange={handleChange}
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
                        checked={values.discount_type === type}
                        handleCheck={handleChange}
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
                  value={values.start_date}
                  handleChange={handleStartDateChange}
                />
              </div>
              <div className="col">
                <DateInput
                  label="Ngày hết hạn"
                  name="expiration_date"
                  value={values.expiration_date}
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
                  label="Nhà xuất bản"
                  name="applicable_publisher"
                  value={values.applicable_publisher}
                  list={publishers}
                  handleChoose={handleChange}
                />
              </div>
              <div className="col mt-4">
                <CheckboxInput
                  label="Dùng với mã khác"
                  name="stackable"
                  value={values.stackable}
                  checked={values.stackable}
                  handleChange={() =>
                    setValues({ ...values, stackable: !values.stackable })
                  }
                />
              </div>
            </div>
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
                type="submit"
                style={{ backgroundColor: `${quaternaryBgColorLight}` }}
                className="btn ms-2"
                onClick={handleSubmit}
              >
                {loading ? 'Đang xử lý...' : 'Cập nhật mã giảm giá'}
              </button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    </StyledCard>
  )
}

const StyledCard = styled.div`
  .card {
    color: ${boldTextColor};
    background-color: ${quaternaryBgColorLight};
  }
  .job-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
    font-weight: bold;
  }
  .btn-status {
    background-color: ${quaternaryBgColor};
    color: ${textColor};
    font-weight: bold;
    border: none;
  }
  .btn-status:hover {
    background-color: #c3d2ff;
  }
  .card-subtitle {
    white-space: nowrap;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${boldTextColor}!important;
  }
  i {
    font-size: 1.25rem;
    margin-right: 0.5rem;
  }
  .status-badge {
    font-size: 1rem;
    text-transform: capitalize;
  }
  .btn {
    margin-top: 1rem;
    color: ${textColor};
    cursor: pointer;
    background-color: ${quaternaryBgColor};
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    box-shadow: ${shadow1};
    font-weight: 600;
    text-transform: uppercase;
  }
  .btn-danger {
    background-color: #d22b2b;
    color: #000;
  }
`

export default CouponItems

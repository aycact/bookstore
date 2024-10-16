import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MdPostAdd } from 'react-icons/md'
import { Modal } from 'react-bootstrap'
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

const fetchPublishers = () => {
  const { isLoading, data, error, isError, refetch } = useQuery({
    queryKey: ['publishers'],
    queryFn: async () => {
      const { data } = await customFetch.get('/publishers')
      return data
    },
  })
  return { isLoading, data, error, isError, refetch }
}

const fetchCoupons = (params) => {
  const { search, status, sort, applicable_publisher, page } = params
  return {
    queryKey: [
      'coupons',
      search ?? '',
      status ?? 'all',
      sort ?? 'mới nhất',
      applicable_publisher ?? 'all',
      page ?? 1,
    ],
    queryFn: () => customFetch.get('/coupons', {params}),
  }
}
export const loader =
  (queryClient) =>
  async ({ request }) => {
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ])
    
    const response = await queryClient.ensureQueryData(fetchCoupons(params))
    const coupons = response.data.coupons
    const meta = response.data.meta
    
    return { coupons, meta, params }
  }

export const action = async ({ request }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  console.log(data)

  try {
    await customFetch.post('/coupons', data)
    toast.success('Thêm mã giảm giá thành công')
    return null
  } catch (error) {
    const errorMessage = error?.response?.data?.msg || 'Create coupon failed'
    console.log(error)
    toast.error('Cần điền đầy đủ thông tin!')
    return null
  }
}

const Coupon = () => {
  const {coupons, meta, params} = useLoaderData()
  const [loading, setLoading] = useState(false)
  const [showCouponModal, setShowCouponModal] = useState(false)
  const handleShowModal = () => setShowCouponModal(true)
  const handleCloseModal = () => setShowCouponModal(false)
  const [values, setValues] = useState({
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
  })

  const {
    isLoading: isLoadingPublishers,
    data: publishersData,
    error: errorPublishers,
    isError: isErrorPublishers,
    refetch: refetchPublishers,
  } = fetchPublishers()

  if (isLoadingPublishers) return <Loading />
  if (isErrorPublishers)
    return <p style={{ marginTop: '1rem' }}>{errorPublishers.message}</p>


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
                <FormInput label="Nhập mã giảm giá" type="text" name="code" />
              </div>
              <div className="col">
                <div>Loại giảm giá</div>
                {['percentage', 'amount'].map((type) => {
                  return (
                    <div className="ms-2" key={type}>
                      <RadiosInput
                        key={type}
                        name="discount_type"
                        value={type}
                        label={type === 'percentage' ? 'Phần trăm' : 'Số tiền'}
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
            />
            <div className="row">
              <div className="col">
                {values.discount_type === 'percentage' ? (
                  <FormInput
                    label="Phần trăm"
                    type="number"
                    name="discount_percentage"
                  />
                ) : (
                  <FormInput
                    label="Số tiền"
                    type="number"
                    name="discount_amount"
                  />
                )}
              </div>
              <div className="col">
                <FormInput
                  label="Áp dụng cho giá trị từ"
                  type="number"
                  name="min_order_value"
                />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <DateInput label="Ngày hiệu lực" name="start_date" />
              </div>
              <div className="col">
                <DateInput label="Ngày hết hạn" name="expiration_date" />
              </div>
            </div>

            <div className="row mt-2">
              <div className="col">
                <FormInput
                  label="Tổng số lần sử dụng"
                  type="number"
                  name="usage_limit"
                />
              </div>
              <div className="col">
                <FormInput
                  label="Số lần sử dụng / khách hàng"
                  type="number"
                  name="limit_per_customer"
                />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <SelectInput
                  defaultValue="all"
                  label="Nhà xuất bản"
                  name="applicable_publisher"
                  list={publishersData?.publishers}
                />
              </div>
              <div className="col mt-4">
                <CheckboxInput label="Dùng với mã khác" name="stackable" />
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
              >
                {loading ? 'Đang xử lý...' : 'Thêm mã giảm giá'}
              </button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
      <div className="coupon-container d-flex flex-row">
        <CouponFilter publishers={publishersData?.publishers} />
        <CouponList coupons={coupons} publishers={publishersData?.publishers} meta={meta} />
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
  }
  .select-label {
    font-size: 1rem;
    font-weight: normal;
  }

  .select-input {
    margin-bottom: 0rem;
  }
`

import React from 'react'
import { Form, Link } from 'react-router-dom'
import { FormInput, SelectInput } from '../../components'
import styled from 'styled-components'
import {
  primaryBgColor,
  quaternaryBgColor,
  quaternaryBgColorLight,
  shadow1,
} from '../../assets/js/variables'
import { useDispatch } from 'react-redux'
import {
  clearFilters,
  handleChangeCouponFilter,
} from '../../features/coupon/couponSlice'
import { useMemo, useState } from 'react'

const CouponStatus = [
  { id: 'active', name: 'Có hiệu lực' },
  { id: 'expired', name: 'Hết hạng' },
  { id: 'deactivated', name: 'Không có hiệu lực' },
]

const sortList = [
  { id: 'mới nhất', name: 'mới nhất' },
  { id: 'cũ nhất', name: 'cũ nhất' },
  { id: 'a-z', name: 'a-z' },
  { id: 'z-a', name: 'z-a' },
]

const CouponFilter = ({ publishers }) => {
  const dispatch = useDispatch()

  const [localSearch, setLocalSearch] = useState('')
  const [currentPublisher, setCurrentPublisher] = useState('')

  const debounce = () => {
    let timeoutID
    return (e) => {
      e.preventDefault()
      setLocalSearch(e.target.value)
      clearTimeout(timeoutID)
      timeoutID = setTimeout(() => {
        dispatch(handleChange({ name: e.target.name, value: e.target.value }))
      }, 1000)
    }
  }

  const optimizedDebounce = useMemo(() => debounce(), [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (e.target.name === 'publisher') setCurrentPublisher(e.target.value)
    dispatch(
      handleChangeCouponFilter({ name: e.target.name, value: e.target.value })
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLocalSearch('')
    setCurrentPublisher('')
    dispatch(clearFilters())
  }
  
  return (
    <Wrapper>
      <Form className="container">
        <div className="row justify-content-center coupon-filter">
          <div className="row">
            <FormInput
              label="Tìm kiếm"
              name="search"
              type="text"
              value={localSearch}
              handleChange={optimizedDebounce}
            />
          </div>
          <div className="row">
            <SelectInput
              label="Trạng thái coupon"
              name="status"
              defaultValue={'enable'}
              list={CouponStatus}
              handleChoose={handleSearch}
            />
          </div>
          <div className="row d-flex justify-content-center">
            <SelectInput
              label="Nhà xuất bản"
              name="applicable_publisher"
              list={publishers}
              value={currentPublisher}
              handleChoose={handleSearch}
            />
          </div>
          <div className="row d-flex justify-content-center mb-2">
            <SelectInput
              defaultValue={'mới nhất'}
              label="Xếp theo"
              name="sort"
              list={sortList}
              handleChoose={handleSearch}
            />
          </div>
          <div className="row d-flex flex-column">
            <button type="button" className="btn my-3" onClick={handleSubmit}>
              Lọc giá trị
            </button>
            <Link to={'/manager/coupon'} className="btn">
              Làm mới
            </Link>
          </div>
        </div>
      </Form>
    </Wrapper>
  )
}

export default CouponFilter

const Wrapper = styled.section`
  margin-left: 1rem;
  .row {
    width: 30rem;
  }
  .select-label {
    color: ${primaryBgColor};
    font-weight: bold;
    margin-top: 1rem;
  }
  .form-label {
    color: ${primaryBgColor};
    font-weight: bold;
    margin-top: 1rem;
  }
  .container {
    top: 6rem;
    margin-bottom: 1rem;
    margin: 0;
    position: sticky;
  }
  .coupon-filter {
    max-width: 250px;
    background-color: ${quaternaryBgColorLight};
    padding: 2rem 1rem;
    border-radius: 1rem;
    box-shadow: ${shadow1};
  }
  input {
    background-color: ${quaternaryBgColor};
  }
  .btn {
    background-color: ${quaternaryBgColor};
    font-weight: bold;
    color: ${primaryBgColor};
  }
`

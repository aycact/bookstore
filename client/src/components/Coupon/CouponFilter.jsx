import React from 'react'
import { Form, Link, useLoaderData } from 'react-router-dom'
import { FormInput, SelectInput } from '../../components'
import styled from 'styled-components'
import {
  primaryBgColor,
  quaternaryBgColor,
  quaternaryBgColorLight,
  shadow1,
} from '../../assets/js/variables'

const CouponStatus = [
  { id: 'enable', name: 'Có hiệu lực' },
  { id: 'expired', name: 'Hết hạng' },
  { id: 'disable', name: 'Không có hiệu lực' },
]

const sortList = [
  { id: 'mới nhất', name: 'mới nhất' },
  { id: 'cũ nhất', name: 'cũ nhất' },
  { id: 'a-z', name: 'a-z' },
  { id: 'z-a', name: 'z-a' },
]

const CouponFilter = ({ publishers }) => {
  const { params } = useLoaderData()
  const { search, status, applicable_publisher, sort } = params
  return (
    <Wrapper>
      <Form className="container">
        <div className="row justify-content-center coupon-filter">
          <div className="row">
            <FormInput
              label="Tìm kiếm"
              name="search"
              type="text"
              defaultValue={search}
            />
          </div>
          <div className="row">
            <SelectInput
              label="Trạng thái coupon"
              name="status"
              defaultValue={'enable'}
              list={CouponStatus}
            />
          </div>
          <div className="row d-flex justify-content-center">
            <SelectInput
              label="Nhà xuất bảng"
              name="applicable_publisher"
              list={publishers}
            />
          </div>
          <div className="row d-flex justify-content-center mb-2">
            <SelectInput label="Xếp theo" name="sort" list={sortList} />
          </div>
          <div className="row d-flex flex-column">
            <button type="submit" className="btn my-3">
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

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  quaternaryBgColorLight,
  textColor,
  shadow1,
} from '../../assets/js/variables'
import { defaultBookImg } from '../../assets/images'
import { customFetch } from '../../utils/axios'
import { useDispatch, useSelector } from 'react-redux'
import {
  DateInput,
  FileInput,
  FormInput,
  Loading,
  SectionTitle,
  SelectInput,
} from '../../components'
import { useQuery } from '@tanstack/react-query'
import { addBook } from '../../features/books/booksSlice'
import dayjs from 'dayjs'
import { getCurrentDateTime } from '../../utils'
import { useLoaderData } from 'react-router-dom'


const AddBook = ({ dataUpdated }) => {
  const {authors, categories, publishers} = useLoaderData()
  const { isLoading: isBookLoading } = useSelector((store) => store.allBooks)
  const dispatch = useDispatch()

  const [preview, setPreview] = useState(null)
  const [values, setValues] = useState({
    title: '',
    price: 0,
    available_copies: 0,
    page_number: 0,
    category_id: null,
    publisher_id: null,
    author_id: null,
    description: '',
    book_img: null,
    publication_date: dayjs(getCurrentDateTime()),
  })

  const handleImgUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setValues({ ...values, book_img: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setValues({ ...values, [name]: value })
  }
  const handleDateChange = (e) => {
    setValues({
      ...values,
      publication_date: e,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ ...values })
    dispatch(addBook({ ...values }))
    setValues({
      title: '',
      price: 0,
      available_copies: 0,
      page_number: 0,
      category_id: null,
      publisher_id: null,
      author_id: null,
      description: '',
      book_img: null,
      publication_date: dayjs(getCurrentDateTime()),
    })
    setPreview(null)
  }

  
  if (isBookLoading) {
    return <Loading />
  }
  return (
    <Wrapper>
      <SectionTitle text="Thêm sách" />
      <div className="container d-flex justify-content-between">
        <section className="row justify-content-center gap-2">
          <div className="col-auto img-container flex-column">
            <img
              src={preview || defaultBookImg}
              alt="book image"
              className="book-img mb-4"
            />
            <FileInput
              label="Tải ảnh"
              name="book_img"
              handleChange={handleImgUpload}
            />
          </div>
          <form className="form col">
            {/* title field */}
            <div className="row gap-3">
              <div className="col-7">
                <FormInput
                  label="Tiêu đề"
                  type="text"
                  name="title"
                  value={values.title}
                  handleChange={handleChange}
                />
              </div>
            </div>
            <div className="row gap-2">
              {/* price field */}
              <div className="col-2">
                <FormInput
                  label="Giá bán"
                  type="number"
                  name="price"
                  value={values.price}
                  handleChange={handleChange}
                />
              </div>

              {/* copies field */}
              <div className="col-2">
                <FormInput
                  label="Số lượng"
                  type="number"
                  name="available_copies"
                  value={values.available_copies}
                  handleChange={handleChange}
                />
              </div>
              {/* page number */}
              <div className="col-2">
                <FormInput
                  label="Số trang"
                  type="number"
                  name="page_number"
                  value={values.page_number}
                  handleChange={handleChange}
                />
              </div>
              <div className="col mt-2">
                <DateInput
                  label="Ngày xuất bản"
                  name="publication_date"
                  value={values.publication_date}
                  handleChange={handleDateChange}
                />
              </div>
            </div>

            <div className="row mb-2 gap-4">
              {/* author field */}
              <div className="col-auto mt-2">
                <SelectInput
                  label="Tác giả"
                  list={authors}
                  name="author_id"
                  handleChoose={handleChange}
                />
              </div>
              {/* category field */}
              <div className="col-auto mt-2">
                <SelectInput
                  label="Thể loại"
                  list={categories}
                  name="category_id"
                  handleChoose={handleChange}
                />
              </div>
              {/* publisher field */}
              <div className="col-auto mt-2">
                <SelectInput
                  label="Nhà xuất bản"
                  list={publishers}
                  name="publisher_id"
                  handleChoose={handleChange}
                />
              </div>
            </div>
            {/* description field */}
            <div className="row description-container">
              <label className="mb-2" htmlFor="description">
                Mô tả
              </label>
              <textarea
                id="description"
                name="description"
                rows="10"
                cols="50"
                className="description-area"
                value={values.description}
                onChange={handleChange}
              />
            </div>
          </form>
          <div className="btn-container">
            <button onClick={handleSubmit} className="btn">
              Thêm sách
            </button>
          </div>
        </section>
      </div>
    </Wrapper>
  )
}
export default AddBook

const Wrapper = styled.section`
  margin-top: 6rem;
  .form {
  }
  .container {
    padding: 2rem 0;
  }
  .description-area {
    background-color: ${quaternaryBgColorLight};
    border-radius: 1rem;
    margin: 0 0.5rem;
    max-width: 45rem;
  }
  .img-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .book-img {
    padding: 0 2rem;
    width: 20rem;
    object-fit: cover;
  }
  .select-label {
    font-size: 1rem;
    font-weight: normal;
  }
  .select-input {
    margin-bottom: 0rem;
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
    float: right;
    margin-right: 5rem;
  }
`

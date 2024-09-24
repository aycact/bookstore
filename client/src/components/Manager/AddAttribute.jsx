import styled from 'styled-components'
import SectionTitle from '../SectionTitle'
import { FormInput, FileInput, Loading, DateInput } from '../../components'
import { defaultBookImg, defaultAvatar } from '../../assets/images'
import {
  quaternaryBgColorLight,
  textColor,
  shadow1,
  primaryBgColorHover,
} from '../../assets/js/variables'
import { useState } from 'react'
import { customFetch } from '../../utils/axios'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import { getCurrentDateTime } from '../../utils'

const AddAttribute = ({ onAddData }) => {
  const [loading, setLoading] = useState(false)
  const [authorPreview, setAuthorPreview] = useState(null)
  const [authorValues, setAuthorValues] = useState({
    name: '',
    bio: '',
    born: dayjs(getCurrentDateTime()),
    job: '',
    place_of_birth: '',
    authorImg: null,
  })
  const [catValues, setCatValues] = useState({
    name: '',
  })
  const [pubValues, setPubValues] = useState({
    name: '',
  })

  const handleImgUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAuthorValues({ ...authorValues, authorImg: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setAuthorPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDateChange = (e) => {
    setAuthorValues({
      ...values,
      born: e,
    })
  }

  const handleChangeAuthor = (e) => {
    const name = e.target.name
    const value = e.target.value
    setAuthorValues({ ...authorValues, [name]: value })
  }
  const handleChangeCat = (e) => {
    const name = e.target.name
    const value = e.target.value
    setCatValues({ ...catValues, [name]: value })
  }
  const handleChangePub = (e) => {
    const name = e.target.name
    const value = e.target.value
    setPubValues({ ...pubValues, [name]: value })
  }

  const handleSubmitAuthor = async (e) => {
    e.preventDefault()
    try {
      const dateOfBirth = `${authorValues.born.$M + 1}/${
        authorValues.born.$D
      }/${authorValues.born.$y}`

      setLoading(true)
      const formData = new FormData()
      formData.append('name', authorValues.name)
      formData.append('job', authorValues.job)
      formData.append('born', dateOfBirth)
      formData.append('place_of_birth', authorValues.place_of_birth)
      formData.append('bio', authorValues.bio)
      formData.append('authorImg', authorValues.authorImg)
      await customFetch.post('/authors', formData)
      toast.success('Add author successfully')
      setAuthorValues({
        name: '',
        bio: '',
        born: dayjs(getCurrentDateTime()),
        job: '',
        place_of_birth: '',
        authorImg: null,
      })
      setAuthorPreview(null)
      onAddData()
    } catch (error) {
      toast.error('Add author failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitCat = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await customFetch.post('/categories', { ...catValues })
      toast.success('Add category successfully')
      setCatValues({
        name: '',
      })
      onAddData()
    } catch (error) {
      toast.error('Add category failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitPub = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await customFetch.post('/publishers', { ...pubValues })
      toast.success('Add publisher successfully')
      setPubValues({
        name: '',
      })
    } catch (error) {
      toast.error('Add publisher failed')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <Wrapper>
      <SectionTitle text="Thêm thuộc tính" />
      <h3 className="mt-4 fw-bold mb-4 heading">Tác Giả</h3>
      <div className="container d-flex justify-content-center">
        <section className="row gap-5">
          <div className="col-auto img-container flex-column">
            <img
              src={authorPreview || defaultAvatar}
              alt="authorImage"
              className="book-img mb-4"
            />
            <FileInput
              label="Tải ảnh"
              name="authorImg"
              handleChange={handleImgUpload}
            />
          </div>
          <form action="" className="col mt-4">
            {/* name field */}
            <div className="row gap-2">
              <div className="col-5">
                <FormInput
                  label="Tên tác giả"
                  type="text"
                  name="name"
                  value={authorValues.name}
                  handleChange={handleChangeAuthor}
                />
              </div>
              <div className="col-3">
                <FormInput
                  label="Nghề nghiệp"
                  type="text"
                  name="job"
                  value={authorValues.job}
                  handleChange={handleChangeAuthor}
                />
              </div>
              <div className="col-3">
                <FormInput
                  label="Nơi sinh"
                  type="text"
                  name="place_of_birth"
                  value={authorValues.place_of_birth}
                  handleChange={handleChangeAuthor}
                />
              </div>
            </div>
            <div className="row">
              <DateInput
                label="Ngày sinh"
                name="born"
                value={authorValues.born}
                handleChange={handleDateChange}
              />
            </div>

            {/* description field */}
            <div className="row description-container mt-3">
              <label className="mb-2" htmlFor="description">
                Tiểu sử
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="4"
                cols="50"
                className="bio-area"
                value={authorValues.bio}
                onChange={handleChangeAuthor}
              />
            </div>
            <div className="btn-container">
              <button onClick={handleSubmitAuthor} className="btn">
                Thêm tác giả
              </button>
            </div>
          </form>
        </section>
      </div>
      <h3 className="mt-4 fw-bold mb-4 heading">Nhà Xuất Bản - Thể Loại</h3>
      <section className="container-no-img row">
        <form action="" className="row">
          <div className="col">
            <FormInput
              label="Thể loại"
              type="text"
              name="name"
              value={catValues.name}
              handleChange={handleChangeCat}
            />
          </div>
          <div className="btn-container col align-content-end">
            <button onClick={handleSubmitCat} className="btn float-none">
              Thêm Thể Loại
            </button>
          </div>
        </form>
        <form action="" className="row">
          <div className="col">
            <FormInput
              label="Nhà xuất bản"
              type="text"
              name="name"
              value={pubValues.name}
              handleChange={handleChangePub}
            />
          </div>
          <div className="btn-container col align-content-end">
            <button onClick={handleSubmitPub} className="btn float-lg-none">
              Thêm Nhà Xuất Bản
            </button>
          </div>
        </form>
      </section>
    </Wrapper>
  )
}
export default AddAttribute

const Wrapper = styled.section`
  .container {
    padding: 0rem 2rem;
  }
  .heading {
    margin-left: 6rem;
    width: fit-content;
    border: 5px solid ${primaryBgColorHover};
    padding: 0.5rem 1rem;
    border-radius: 1rem;
  }
  .bio-area {
    background-color: ${quaternaryBgColorLight};
    border-radius: 1rem;
    margin: 0 0.5rem;
    width: 45vw;
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

  .img-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 5rem;
  }
  .book-img {
    padding: 0 2rem;
    width: 20rem;
    height: 20rem;
    object-fit: cover;
  }
  .btn-container {
    margin-bottom: 0.5rem;
  }
  .container-no-img {
    padding: 0 12rem;
    width: 100vw;
    padding-bottom: 3rem;
  }
`

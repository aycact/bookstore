import FormInput from '../FormInput'
import Form from 'react-bootstrap/Form'
import { ListInput, SelectInput } from '../'
import { useQuery } from '@tanstack/react-query'
import styled from 'styled-components'
import {
  primaryBgColor,
  quaternaryBgColor,
  primaryBgColorHover,
  boldTextColor,
} from '../../assets/js/variables'
import Button from 'react-bootstrap/Button'
import { clearFilters, handleChangeBookFilter } from '../../features/books/booksSlice'
import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLoaderData } from 'react-router-dom'

const Sidebar = () => {
  const { categories, publishers } = useLoaderData()
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
        dispatch(handleChangeBookFilter({ name: e.target.name, value: e.target.value }))
      }, 1000)
    }
  }

  const optimizedDebounce = useMemo(() => debounce(), [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (e.target.name === 'publisher') setCurrentPublisher(e.target.value)
    dispatch(handleChangeBookFilter({ name: e.target.name, value: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLocalSearch('')
    setCurrentPublisher('')
    dispatch(clearFilters())
  }

  return (
    <Wrapper>
      <form className="sidebar">
        <FormInput
          label="Tìm kiếm"
          type="text"
          name="search"
          placeholder="Search"
          value={localSearch}
          handleChange={optimizedDebounce}
        />
        <ListInput
          label="Thể loại"
          list={categories}
          name="category"
          handleChoose={handleSearch}
        />
        <SelectInput
          label="Nhà xuất bản"
          list={publishers}
          name="publisher"
          value={currentPublisher}
          handleChoose={handleSearch}
        />
        <Button onClick={handleSubmit} className="btn-sm">
          Xóa bộ lọc
        </Button>
      </form>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  .sidebar {
    width: 12.5rem;
    position: sticky;
    top: 3rem;
    margin-bottom: 1rem;
  }

  .form-control {
    background-color: ${quaternaryBgColor};
  }
  .form-label {
    font-size: 1.25rem;
    font-weight: bold;
    color: ${boldTextColor};
  }
  .btn-sm {
    color: ${quaternaryBgColor};
    font-weight: bold;
    background-color: ${primaryBgColor};
    border-color: ${primaryBgColorHover};
  }
  .btn.btn-sm:active {
    background-color: ${quaternaryBgColor};
    color: ${primaryBgColor};
  }
  .select-label {
    font-size: 1.25rem;
    font-weight: bold;
  }
`
export default Sidebar

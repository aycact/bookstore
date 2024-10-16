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
import { customFetch } from '../../utils/axios'
import { clearFilters, handleChange } from '../../features/books/booksSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useMemo, useState } from 'react'

const fetchCategories = () => {
  const { isLoading, data, error, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await customFetch.get('/categories')
      return data
    },
  })
  return { isLoading, data, error, isError }
}

const fetchPublishers = () => {
  const { isLoading, data, error, isError } = useQuery({
    queryKey: ['publishers'],
    queryFn: async () => {
      const { data } = await customFetch.get('/publishers')
      return data
    },
  })
  return { isLoading, data, error, isError }
}

const Sidebar = () => {
  const dispatch = useDispatch()
  const [localSearch, setLocalSearch] = useState('');

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
    dispatch(handleChange({ name: e.target.name, value: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLocalSearch('')
    dispatch(clearFilters())
  }

  const {
    isLoading: isLoadingCategories,
    data: categoriesData,
    error: errorCategories,
    isError: isErrorCategories,
  } = fetchCategories()
  const {
    isLoading: isLoadingPublishers,
    data: publishersData,
    error: errorPublishers,
    isError: isErrorPublishers,
  } = fetchPublishers()

  if (isLoadingCategories)
    return <p style={{ marginTop: '1rem' }}>Loading...</p>
  if (isErrorCategories)
    return <p style={{ marginTop: '1rem' }}>{errorCategories.message}</p>
  if (isLoadingPublishers)
    return <p style={{ marginTop: '1rem' }}>Loading...</p>
  if (isErrorPublishers)
    return <p style={{ marginTop: '1rem' }}>{errorPublishers.message}</p>

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
          list={categoriesData.categories}
          name="category"
          handleChoose={handleSearch}
        />
        <SelectInput
          defaultValue="all"
          label="Nhà xuất bản"
          list={publishersData?.publishers}
          name="publisher"
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

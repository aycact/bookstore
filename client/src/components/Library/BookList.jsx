import React from 'react'
import {
  shadow4,
  tertiaryBgColor,
  quaternaryBgColor,
  boldTextColor,
} from '../../assets/js/variables'
import styled from 'styled-components'
import Row from 'react-bootstrap/Row'
import PaginationContainer from '../PaginationContainer'
import BookItem from './BookItem'
import Loading from '../Loading'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getAllBooks, handleChange } from '../../features/books/booksSlice'

const BookList = () => {
  const dispatch = useDispatch()
  const {
    books,
    isLoading,
    page,
    totalBooks,
    numOfPages,
    search,
    category,
    publisher,
    author,
    sort,
  } = useSelector((store) => store.allBooks)

  console.log({page, search, category, publisher, author, sort})
  
  useEffect(() => {
    dispatch(getAllBooks())
  }, [page, search, category, publisher, author, sort])

  const bookList = books
  const meta = { page, numOfPages, totalBooks }

  if (isLoading) return <Loading />

  if (books.length === 0) {
    return (
      <Wrapper className='justify-content-center align-content-center'>
        <h2 className='text-center fw-bold'>No books to display...</h2>
      </Wrapper>
    )
  }
  return (
    <Wrapper>
      <div className="segment">
        <h3 className="mx-5 segment-heading mb-3">
          {totalBooks} Kết quả
        </h3>

        <Row xs={1} md={2} lg={3} className="g-5 mx-3">
          {bookList.map((book) => {
            return <BookItem book={book} key={book.id} />
          })}
        </Row>

        <PaginationContainer
          meta={meta}
          handleChange={handleChange}
          className="pagination"
        />
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  width: 100%;
  .segment {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .b-card:hover {
    box-shadow: ${shadow4};
    cursor: pointer;
  }

  .b-card-body {
    background: ${quaternaryBgColor};
    border-radius: 0 0 5px 5px;
    height: 10.25rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`
export default BookList

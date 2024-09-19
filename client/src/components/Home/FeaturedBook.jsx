import Row from 'react-bootstrap/Row'
import { useLoaderData, Link } from 'react-router-dom'
import styled from 'styled-components'
import BookItem from '../Library/BookItem'

const FeaturedBook = () => {
  const { newBooks } = useLoaderData()
  return (
    <Wrapper className="segment">
      <h3 className="mx-5 segment-heading mb-3">Sách Mới</h3>
      <Row xs={1} md={2} lg={4} className="g-5 mx-3">
        {newBooks.map((book) => {
          return <BookItem book={book} key={book.id} />
        })}
      </Row>
    </Wrapper>
  )
}
export default FeaturedBook

const Wrapper = styled.section`
  a {
    text-decoration: none;
  }
`

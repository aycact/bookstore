import Row from 'react-bootstrap/Row'
import styled from 'styled-components'
import BookItem from '../Library/BookItem'
import { shadow4, quaternaryBgColorLight } from '../../assets/js/variables'

const FeaturedBook = ({ newBooks, title, maxWidthItems, gap }) => {
  return (
    <Wrapper className="segment">
      <h3 className="segment-heading mb-3 featured-book-heading">{title}</h3>
      <Row
        xs={1}
        md={2}
        lg={maxWidthItems}
        className={`${gap} g-5 justify-content-start`}
      >
        {newBooks?.map((book) => {
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

  .b-card:hover {
    box-shadow: ${shadow4};
    cursor: pointer;
  }

  .b-card-body {
    background: ${quaternaryBgColorLight};
    border-radius: 0 0 5px 5px;
  }
`

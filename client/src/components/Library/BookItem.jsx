import React from 'react'
import {
  shadow4,
  tertiaryBgColor,
  quaternaryBgColor,
  boldTextColor,
} from '../../assets/js/variables'
import styled from 'styled-components'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils'

const BookItem = ({ book }) => {
  // Đặt ảnh mặc định nếu không có ảnh từ dữ liệu sách
  const image = book.book_img || 'https://via.placeholder.com/150'
  return (
    <Wrapper>
      <Link key={book.id} to={`/library/${book.id}`}>
        <Col key={book.id}>
          <Card className="b-card h-100">
            <Card.Img variant="top" src={image} />
            <Card.Body className="b-card-body">
              <Card.Title className="fw-bold">{book.title}</Card.Title>
              <Card.Text>{book.author}</Card.Text>
            </Card.Body>
            <div className="price-tag">{formatPrice(book.price)}</div>
          </Card>
        </Col>
      </Link>
    </Wrapper>
  )
}

export default BookItem

const Wrapper = styled.section`
  a {
    text-decoration: none;
  }

  .b-card {
    position: relative;
    background-color: ${tertiaryBgColor};
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .b-card:hover {
    transform: translateY(-5px);
    box-shadow: ${shadow4};
    cursor: pointer;
  }

  .b-card-body {
    background: ${quaternaryBgColor};
    border-radius: 0 0 5px 5px;
    height: 8rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .price-tag {
    width: fit-content;
    position: absolute;
    right: 0;
    bottom: 0;
    margin: 0.5rem 1rem;
    font-weight: bold;
    color: ${boldTextColor};
  }

  .card-img-top {
    height: 280px;
    object-fit: cover; /* Đảm bảo ảnh được cắt phù hợp với kích thước */
  }
`

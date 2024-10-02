import { useLoaderData, Link } from 'react-router-dom'
import { useState } from 'react'
import { addItem } from '../../features/cart/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { customFetch } from '../../utils/axios'
import { CommentSection, MyBreadCrumb, SelectInput } from '../../components'
import {
  quaternaryBgColorLight,
  shadow1,
  textColor,
} from '../../assets/js/variables'
import { formatPrice } from '../../utils'
import StarRatings from 'react-star-ratings'

// Query function
const singleBookQuery = (id) => {
  // trả về query object
  return {
    queryKey: ['book', id || ''],
    queryFn: () => customFetch(`/books/${id}`),
  }
}

const singleBookReviewQuery = (id) => {
  // trả về query object
  return {
    queryKey: ['singleBookReviewQuery', id || ''],
    queryFn: () => customFetch(`/reviews/books/${id}`),
  }
}

//loader
export const loader =
  (queryClient) =>
  async ({ params }) => {
    const { id } = params
    const [responseBook, responseReviews] = await Promise.all([
      queryClient.ensureQueryData(singleBookQuery(id)),
      queryClient.ensureQueryData(singleBookReviewQuery(id)),
    ])
    const book = responseBook.data.book
    const reviews = responseReviews.data.reviews
    return { book, reviews }
  }

const SingleBook = () => {
  const defaultImg = 'https://via.placeholder.com/150'
  // data
  const { user } = useSelector((store) => store.user)
  const { book, reviews } = useLoaderData()
  const {
    id: book_id,
    book_img,
    title,
    price,
    description,
    available_copies,
    publisher,
    author,
    category,
    author_id,
    page_number,
    average_rating,
  } = book
  //  generate option
  const list = Array.from({ length: available_copies }, (_, i) => ({
    id: i + 1,
    name: i + 1,
  }))
  // handle amount
  const [amount, setAmount] = useState(1)
  //  handle submit
  const handleSelectAmount = (event) => {
    const value = event.target.value
    setAmount(parseInt(value))
  }
  // redux
  const dispatch = useDispatch()
  // create cart identity
  const cartBook = {
    cartId: book.id,
    bookId: book.id,
    image: book_img,
    title,
    price,
    description,
    author,
    amount,
    category,
    publisher,
    available_copies,
    page_number,
  }
  // Add to cart function
  const addToCart = () => {
    dispatch(addItem(cartBook))
  }

  const breadcrumbItems = [
    { label: 'Trang chủ', path: '/', active: false },
    { label: 'Nhà sách', path: '/library', active: false },
    { label: title, path: `/${title}`, active: true },
  ]

  return (
    <Wrapper>
      {/* BREADCRUMB */}
      <div className="container">
        <div className="row first-row">
          {/* IMAGE */}
          <div className="col-sm-5 col-12">
            <MyBreadCrumb breadcrumbItems={breadcrumbItems} />
            <img
              src={book_img || defaultImg}
              alt={title}
              className="object-cover book-img"
            />
          </div>

          <div className="col-sm-6 col-12">
            {/* INFORMATION */}
            <h2 className="">{title}</h2>
            <Link
              className="author-link"
              key={author_id}
              to={`/author/${author_id}`}
            >
              <p className="author-name">{author.name}</p>
            </Link>
            <div className="d-flex align-items-center gap-3">
              <StarRatings
                rating={Number(average_rating) || 0}
                starRatedColor="green"
                numberOfStars={5}
                name="rating"
                starDimension="22px"
              />
              <p style={{ paddingTop: '6px' }}>{Number(average_rating) || 0}</p>
            </div>
            {/* basic info */}
            <div className="basic-info">
              <p className="publisher-name">{`Nhà xuất bản: ${publisher.name}`}</p>
              <p className="category">{`Thể loại: ${category.name}`}</p>
              <p className="page-number">{`Số trang: ${page_number}`}</p>
              <p className="price">
                Giá bán: <span className="fw-bold">{formatPrice(price)}</span>
              </p>
              {user?.role === 'admin' && (
                <p className="book-amount ">
                  Số lượng hiện có:{' '}
                  <span className="fw-bold">{available_copies} quyển</span>
                </p>
              )}
            </div>
            {/* AMOUNT */}
            {user?.role !== 'admin' && (
              <div className="">
                <SelectInput
                  list={list}
                  name="Amount"
                  handleChoose={handleSelectAmount}
                  defaultValue={1}
                />
              </div>
            )}
            {/* SUBMIT BTN */}
            {user?.role !== 'admin' && (
              <button className="btn" onClick={addToCart}>
                Thêm vào giỏ hàng
              </button>
            )}
          </div>
        </div>
        <div className="row">
          <p className="description">{description}</p>
        </div>
      </div>
      <CommentSection book_id={book_id} reviews={reviews} />
    </Wrapper>
  )
}

export default SingleBook

const Wrapper = styled.section`
  .container {
    margin-top: 5rem;
    max-width: 100vw;
    padding: 3rem;
    padding-bottom: 0;
  }
  .row {
    gap: 4rem;
    justify-content: center;
  }
  .img-container {
    display: grid;
  }
  .book-img {
    border-radius: 2rem;
    width: 24rem;
  }
  .author-name {
    font-weight: bold;
    font-size: 1rem;
  }
  p {
    margin-bottom: 0;
    font-weight: 500;
  }
  .description {
    margin-top: 1rem;
    margin-bottom: 1rem;
    line-height: 2rem;
    letter-spacing: 0.05rem;
    padding: 0 6rem;
    text-align: justify;
    font-size: 1.25rem;
    font-weight: normal;
  }
  .basic-info {
    margin: 1rem 0;
  }
  .select-label {
    font-size: 1rem;
    color: ${textColor};
  }
  .select-input {
    width: 4rem;
    color: ${textColor};
    background-color: ${quaternaryBgColorLight};
  }
  .btn {
    background-color: ${quaternaryBgColorLight};
    box-shadow: ${shadow1};
    color: ${textColor};
    font-weight: bold;
  }
  .breadcrumb {
    padding-left: 1rem;
    margin: 0;
    margin-bottom: 1rem;
  }
  .breadcrumb li {
    font-size: 1rem;
  }
  .first-row {
    margin-bottom: 1.5rem;
    padding-left: 5rem;
  }
  .author-link {
    text-decoration: none;
  }
  .author-link:hover {
    text-decoration: underline;
    text-decoration-color: ${textColor};
  }
`

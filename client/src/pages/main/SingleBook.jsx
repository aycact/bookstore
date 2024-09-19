import { useLoaderData, Link } from 'react-router-dom'
import { useState } from 'react'
import { addItem } from '../../features/cart/cartSlice'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { customFetch } from '../../utils/axios'
import { MyBreadCrumb, SelectInput } from '../../components'
import {
  quaternaryBgColorLight,
  shadow1,
  textColor,
} from '../../assets/js/variables'
import { formatPrice } from '../../utils'

// Query function
const singleBookQuery = (id) => {
  // trả về query object
  return {
    queryKey: ['book', id || ''],
    queryFn: () => customFetch(`/books/${id}`),
  }
}

//loader
export const loader =
  (queryClient) =>
  async ({ params }) => {
    const { id } = params
    const response = await queryClient.ensureQueryData(singleBookQuery(id))
    const book = response.data.book
    return { book }
  }

const SingleBook = () => {
  const defaultImg = 'https://via.placeholder.com/150'
  // data
  const { book } = useLoaderData()
  const {
    book_img,
    title,
    price,
    description,
    available_copies,
    publisher,
    author,
    category,
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
  }
  // Add to cart function
  const addToCart = () => {
    dispatch(addItem(cartBook))
  }

  const breadcrumbItems = [
    { label: 'Home', path: '/', active: false },
    { label: 'Library', path: '/library', active: false },
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
            <p className="author-name">{author.name}</p>
            <div className="basic-info">
              <p className="publisher-name">{`Nhà xuất bản: ${publisher.name}`}</p>
              <p className="category">{`Thể loại: ${category.name}`}</p>
              <p className="price">
                Giá bán: <span className='fw-bold'>{formatPrice(price)}</span>
              </p>
            </div>
            {/* AMOUNT */}
            <div className="">
              <SelectInput
                list={list}
                name="Amount"
                handleChoose={handleSelectAmount}
                defaultValue={1}
              />
            </div>
            {/* SUBMIT BTN */}
            <button className="btn" onClick={addToCart}>
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
        <div className="row">
          <p className="description">{description}</p>
        </div>
      </div>
    </Wrapper>
  )
}

export default SingleBook

const Wrapper = styled.section`
  .container {
    margin-top: 5rem;
    max-width: 100vw;
    padding: 3rem;
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
    height: 24rem;
    width: 20rem;
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
`

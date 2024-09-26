import { useLoaderData, Link } from 'react-router-dom'
import { useState } from 'react'
import { addItem } from '../../features/cart/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { customFetch } from '../../utils/axios'
import { FeaturedBook, MyBreadCrumb, SelectInput } from '../../components'
import {
  quaternaryBgColorLight,
  shadow1,
  textColor,
} from '../../assets/js/variables'

const singleAuthorQuery = (id) => {
  // trả về query object
  return {
    queryKey: ['author', id || ''],
    queryFn: () => customFetch(`/authors/${id}`),
  }
}

const getFeaturedBooks = (id) => {
  // trả về query object
  return {
    queryKey: ['books?author=', id || ''],
    queryFn: () => customFetch(`books?author=${id}`),
  }
}

export const loader =
  (queryClient) =>
  async ({ params }) => {
    const { id } = params
    const responseAuthor = await queryClient.ensureQueryData(singleAuthorQuery(id))
    const responseBook = await queryClient.ensureQueryData(getFeaturedBooks(id))
    const author = responseAuthor.data.author
    const featuredBooks = responseBook.data.books
    console.log(featuredBooks);
    
    return { author, featuredBooks }
  }

const SingleAuthor = () => {
  const { author, featuredBooks } = useLoaderData()
  console.log(featuredBooks)
  
  return (
    <Wrapper>
      {/* BREADCRUMB */}
      <div className="container">
        <div className="row first-row">
          {/* IMAGE */}
          <div className="col-sm-3 col-2">
            {/* <MyBreadCrumb breadcrumbItems={breadcrumbItems} /> */}
            <img
              src={author.authorImg}
              alt={''}
              className="object-cover book-img"
            />

            <h5 className="info">{'Thông tin cá nhân'}</h5>
            <div className="basic-info">
              <p className="date-of-birth">
                Ngày sinh: <span className="fw-bold">{author.born}</span>
              </p>
              <p className="place-of-birth">
                Nơi sinh:{' '}
                <span className="fw-bold">{author.place_of_birth}</span>
              </p>
              <p className="job">
                Nghề nghiệp: <span className="fw-bold">{author.job}</span>
              </p>
            </div>
          </div>

          <div className="col-sm-8 col-6">
            {/* INFORMATION */}
            <h2 className="">{author.name}</h2>
            <div className="description">{author.bio}</div>
            <FeaturedBook newBooks={featuredBooks} title="Tác phẩm" maxWidthItems={3} gap={'gap-0'}/>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
export default SingleAuthor

const Wrapper = styled.section`
  .container {
    margin-top: 5rem;
    max-width: 100vw;
   
  }
  .row {
    gap: 4rem;
    justify-content: center;
  }
  .img-container {
    display: grid;
  }
  .book-img {
    width: 18rem;
  }
  .info {
    margin-top: 1rem;
    margin-bottom: 0;
    font-weight: bold;
    font-size: 1.25rem;
  }
  p {
    margin-bottom: 0;
    font-weight: 500;
    width: 100%!important;
  }
  .description {
    margin-top: 1rem;
    margin-bottom: 1rem;
    line-height: 2rem;
    letter-spacing: 0.05rem;
    text-align: justify;
    font-size: 1.25rem;
  }
  .basic-info {
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
    padding: 2rem;
    margin-bottom: 1.5rem;
  }
  .featured-book-heading {
    margin: 0;
  }
`

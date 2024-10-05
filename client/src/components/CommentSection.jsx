import React, { useEffect, useState } from 'react'
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBTypography,
} from 'mdb-react-ui-kit'
import {
  quaternaryBgColor,
  quaternaryBgColorLight,
} from '../assets/js/variables'
import styled from 'styled-components'
import { defaultAvatar } from '../assets/images'
import { formatVNTimeZoneDate, ratingTitle } from '../utils'
import { FaStar } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { customFetch } from '../utils/axios'
import StarRatings from 'react-star-ratings'
import { toast } from 'react-toastify'
import Loading from './Loading'

export default function CommentSection({ book_id, reviews }) {
  const [loading, setLoading] = useState(false)
  const [values, setValues] = useState({
    rating: 5,
    comment: '',
  })
  const [title, setTitle] = useState(ratingTitle(values.rating))
  const { user, isLoading } = useSelector((store) => store.user)
  const [userReview, setUserReview] = useState(null)

  const handleRatingChange = (e) => {
    setValues({ ...values, rating: e })
  }
  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setValues({ ...values, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const review = {
        rating: values.rating,
        comment: values.comment,
        book_id,
      }

      await customFetch.post('/reviews', review)
      setValues({
        rating: 5,
        comment: '',
      })
      toast.success('Đánh giá đã được gửi')
    } catch (error) {
      console.log(error)
      toast.warn(error?.response?.data?.msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchUserReview = async () => {
      if (user) {
        try {
          const response = await customFetch(
            `/reviews/getCurrentUserReviewSingleBook/${book_id}`
          )
          setUserReview(response.data.review)
        } catch (error) {
          console.error('Error fetching user review:', error)
        }
      }
    }

    fetchUserReview()
  }, [book_id, loading, user])

  useEffect(() => {
    setTitle(ratingTitle(values.rating))
  }, [values.rating])

  if(loading)
    return <Loading/>
  return (
    <Wrapper style={{ backgroundColor: `${quaternaryBgColor}` }}>
      <MDBContainer className="mt-2 " style={{ maxWidth: '100vw' }}>
        <MDBRow className="justify-content-center">
          <MDBCol md="12" lg="10">
            <MDBCard className="text-dark comment-container">
              <MDBCardBody className="p-4">
                {userReview && user ? (
                  <div>
                    <MDBTypography tag="h4" className="mb-4">
                      Đánh giá của bạn
                    </MDBTypography>
                    <div className="d-flex flex-start">
                      <div
                        style={{ width: '12rem' }}
                        className="d-flex flex-column align-items-center"
                      >
                        <MDBCardImage
                          className="rounded-circle shadow-1-strong me-3"
                          src={userReview?.user?.user_img || defaultAvatar}
                          alt="avatar"
                          width="60"
                          height="60"
                        />
                        <MDBTypography tag="h6" className="fw-bold mb-1">
                          {userReview?.user?.name}
                        </MDBTypography>
                        <p className="mb-0">
                          {formatVNTimeZoneDate(userReview?.created_at)}
                        </p>
                      </div>
                      <div style={{ width: '70vw', marginLeft: '1rem' }}>
                        <div className="d-flex align-items-center justify-content-start mb-3">
                          <span
                            className="badge bg-success"
                            style={{ fontSize: '1rem', color: '#FFBF00' }}
                          >
                            {userReview?.rating}
                            <FaStar className="pb-1 ms-1" />
                          </span>
                          <h5 className="mb-0 ms-2">
                            {ratingTitle(userReview?.rating)}
                          </h5>
                        </div>
                        <div className="mb-0">{userReview?.comment}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex flex-column">
                    <label htmlFor="description">
                      <h5 className="mb-0">Viết đánh giá của bạn</h5>
                    </label>
                    <div className="d-flex">
                      <StarRatings
                        changeRating={handleRatingChange}
                        rating={values.rating}
                        starRatedColor="rgb(230, 67, 47)"
                        numberOfStars={5}
                        name="rating"
                        starDimension="22px"
                      />
                      <h5 className="mb-0 mt-2 ms-3">{title}</h5>
                    </div>
                    <textarea
                      id="description"
                      name="comment"
                      rows="5"
                      cols="115"
                      className="description-area mt-2"
                      value={values.comment}
                      onChange={handleChange}
                    />
                    <div className="btn-container">
                      <button
                        disabled={!user}
                        type="button"
                        onClick={handleSubmit}
                        className="btn"
                      >
                        Gửi đánh giá
                      </button>
                    </div>
                  </div>
                )}
              </MDBCardBody>

              <hr className="my-0" />
              <div className="ms-4 mt-4">
                <MDBTypography tag="h4" className="mb-0">
                  Những đánh giá gần đây
                </MDBTypography>
                <p className="fw-light pb-2">
                  Đánh giá mới nhất bởi người dùng
                </p>
              </div>
              {reviews?.length === 0 && (
                <h5 className="ms-4">Chưa có đánh giá nào...</h5>
              )}
              {reviews?.map((review) => {
                return (
                  user?.userId !== review?.user_id && (
                    <MDBCardBody className="p-4" key={review?.id}>
                      <div className="d-flex flex-start">
                        <div
                          style={{ width: '12rem' }}
                          className="d-flex flex-column align-items-center"
                        >
                          <MDBCardImage
                            className="rounded-circle shadow-1-strong me-3"
                            src={review?.user?.user_img || defaultAvatar}
                            alt="avatar"
                            width="60"
                            height="60"
                          />
                          <div>
                            <MDBTypography tag="h6" className="fw-bold mb-1">
                              {review?.user?.name}
                            </MDBTypography>
                          </div>
                          <p className="mb-0">
                            {formatVNTimeZoneDate(review?.created_at)}
                          </p>
                        </div>
                        <div style={{ width: '70vw', marginLeft: '3rem' }}>
                          <div className="d-flex align-items-center justify-content-start mb-3">
                            <span
                              className="badge bg-success"
                              style={{ fontSize: '1rem', color: '#FFBF00' }}
                            >
                              {review?.rating}
                              <FaStar className="pb-1 ms-1" />
                            </span>
                            <h5 className="mb-0 ms-2">
                              {ratingTitle(review?.rating)}
                            </h5>
                          </div>
                          <div className="mb-0">{review?.comment}</div>
                        </div>
                      </div>
                    </MDBCardBody>
                  )
                )
              })}
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  .comment-container {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    background-color: ${quaternaryBgColorLight};
  }
  .description-area {
    background-color: ${quaternaryBgColorLight};
    border-radius: 1rem;
  }
  .btn-container {
    margin-top: 1rem;
  }
  .btn {
    background-color: ${quaternaryBgColor};
    float: right;
  }
`

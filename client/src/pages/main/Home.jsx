import React from 'react'
import { FeaturedBook, MyCarousel, AspirationSegment } from '../../components'
import styled from 'styled-components'
import {
  shadow4,
  quaternaryBgColor,
  quaternaryBgColorLight,
} from '../../assets/js/variables'
import { customFetch } from '../../utils/axios'
import { useLoaderData } from 'react-router-dom'

export const loader = async () => {
  const resp = await customFetch('books/findNewBooks')
  return { newBooks: resp.data.newBooks }
}

const Home = () => {
  const { newBooks } = useLoaderData()
  return (
    <Wrapper>
      <div className="mt-lg-5 position-relative">
        <MyCarousel />
        <div className="divider position-absolute">━━━━━━━━༻❁༺━━━━━━━━</div>
        <div className='mx-5'>
          <div>

          <FeaturedBook
            newBooks={newBooks}
            title="Sách mới"
            maxWidthItems={4}
          />
          </div>
        </div>
        <AspirationSegment />
      </div>
    </Wrapper>
  )
}

export default Home

const Wrapper = styled.section`
  .b-card:hover {
    box-shadow: ${shadow4};
    cursor: pointer;
  }

  .b-card-body {
    background: ${quaternaryBgColorLight};
    border-radius: 0 0 5px 5px;
  }

  .a-card {
    padding: 40px 32px;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    background: ${quaternaryBgColor} !important;
  }
  .a-card:hover {
    box-shadow: ${shadow4};
    cursor: pointer;
  }
  .a-card .card-icon {
    line-height: 5rem;
    text-align: center;
    background-color: ${quaternaryBgColorLight};
    font-size: 3rem;
    height: 100px;
    width: 100px;
  }

  .a-card-body {
    border-radius: 0 0 5px 5px;
  }
  .a-card-body .card-title {
    font-size: 2rem;
    text-shadow: ${shadow4};
    margin-bottom: 1rem;
  }

  .card-container {
    display: flex;
    flex-direction: row;
    gap: 5rem;
    height: 18rem;
  }

  .flip-card {
    width: 300px;
    height: 200px;
    perspective: 1000px; /* Remove this if you don't want the 3D effect */
  }
  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }
  .flip-card-inner:hover {
    transform: rotateY(180deg);
  }
  .flip-card-front,
  .flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden; /* Safari */
    backface-visibility: hidden;
  }
  .flip-card-back {
    transform: rotateY(180deg);
  }
`

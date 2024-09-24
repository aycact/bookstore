import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const CarouselImage = ({ text, src }) => {
  return (
    <Wrapper>
      <div className="carousel-image">
        {/* Nếu sử dụng hình ảnh từ file local */}
        <img src={src} alt={text} className="d-block rounded-5 " />

        {/* Nếu chỉ muốn hiển thị văn bản cho hình ảnh */}
        {/* <div className="carousel-image-text">{text}</div> */}
      </div>
    </Wrapper>
  )
}

CarouselImage.propTypes = {
  text: PropTypes.string.isRequired,
  src: PropTypes.string, // URL của hình ảnh
}

export default CarouselImage

const Wrapper = styled.section`
  .carousel-image img {
    filter: brightness(70%);
  }
`


import React from 'react'
import PropTypes from 'prop-types'
import '../../assets/scss/Carousel.scss' 

const CarouselImage = ({ text, src }) => {
  return (
    <div className="carousel-image">
      {/* Nếu sử dụng hình ảnh từ file local */}
      <img src={src} alt={text} className="d-block rounded-5 " />

      {/* Nếu chỉ muốn hiển thị văn bản cho hình ảnh */}
      {/* <div className="carousel-image-text">{text}</div> */}
    </div>
  )
}

CarouselImage.propTypes = {
  text: PropTypes.string.isRequired,
  src: PropTypes.string, // URL của hình ảnh
}


export default CarouselImage

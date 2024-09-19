import Carousel from 'react-bootstrap/Carousel'
import CarouselImage from './CarouselImage'
import { slide1, slide2, slide3, slide4 } from '../../assets/images'
import '../../assets/scss/Carousel.scss'

const MyCarousel = () => {
  return (
    <Carousel className="my-carousel">
      <Carousel.Item interval={1000} className="my-carousel-item">
        <CarouselImage text="First slide" src={slide1} />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={1000} className="my-carousel-item">
        <CarouselImage text="Second slide" src={slide2} />
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={1000} className="my-carousel-item">
        <CarouselImage text="Third slide" src={slide3} />
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item className="my-carousel-item">
        <CarouselImage text="Fourth slide" src={slide4} />
        <Carousel.Caption>
          <h3>Fourth slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  )
}
export default MyCarousel

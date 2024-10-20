import Carousel from 'react-bootstrap/Carousel'
import CarouselImage from './CarouselImage'
import { slide1, slide2, slide3, slide4 } from '../../assets/images'
import styled from 'styled-components'
import {
  quaternaryBgColor,
  primaryBgColor,
  quaternaryBgColorLight,
} from '../../assets/js/variables'

const MyCarousel = () => {
  return (
    <Wrapper>
      <Carousel className="my-carousel">
        <Carousel.Item interval={3000} className="my-carousel-item">
          <CarouselImage
            text="First slide"
            src={slide1}
            className="img-container"
          />
          <Carousel.Caption>
            <h3>Báo Phong Hóa</h3>
            <p>
              {' '}
              Tuần báo xuất bản tại Hà Nội (Việt Nam), và đã trải qua hai thời
              kỳ: từ số 1 (ra ngày 16 tháng 6 năm 1932) đến số 13 (ra ngày 8
              tháng 9 năm 1932).
            </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={3000} className="my-carousel-item">
          <CarouselImage text="Second slide" src={slide2} />
          <Carousel.Caption>
            <h3>"Lê Phong phóng viên trinh thám" của Thế Lữ</h3>
            <p>
              Một loạt các truyện ngắn về Lê Phong, một phóng viên chuyên tham
              gia phá các vụ án bí hiểm với phương pháp suy luận của Sherlock
              Holmes
            </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={3000} className="my-carousel-item">
          <CarouselImage text="Third slide" src={slide3} />
          <Carousel.Caption>
            <h3>Kawabata Yasunari</h3>
            <p>
              {' '}
              Người Nhật đầu tiên và người châu Á thứ ba, sau Rabindranath
              Tagore (Ấn Độ năm 1913) và Shmuel Yosef Agnon (Israel năm 1966),
              đoạt Giải Nobel Văn học năm 1968
            </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={3000} className="my-carousel-item">
          <CarouselImage text="Fourth slide" src={slide4} />
          <Carousel.Caption>
            <h3>Chủ nghĩa hậu hiên đại</h3>
            <p>
              Một xu hướng trong nền văn hóa đương đại được đặc trưng bởi sự
              chối bỏ sự thật khách quan và siêu tự sự.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </Wrapper>
  )
}
export default MyCarousel

const Wrapper = styled.section`
  .my-carousel {
    padding-bottom: 2rem;
    text-shadow: 2px 2px 4px black;
    background-color: ${quaternaryBgColorLight};
  }

  .my-carousel .carousel-indicators {
    margin-bottom: 2rem;
  }

  .my-carousel .carousel-indicators button {
    background-color: ${primaryBgColor};
  }

  .my-carousel .my-carousel-item {
    position: relative;
    height: 450px;
  }

  .my-carousel .my-carousel-item .carousel-image {
    width: 95%;
    padding-bottom: 30%;
    height: 0;
    position: absolute;
    top: 8%;
    left: 50%;
    transform: translateX(-50%);
  }

  .my-carousel .my-carousel-item .carousel-image img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .my-carousel .my-carousel-item .carousel-caption {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .my-carousel .my-carousel-item .carousel-caption h3,
  .my-carousel .my-carousel-item .carousel-caption p {
    color: ${quaternaryBgColor};
  }
`

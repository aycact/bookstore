import { aboutImage } from '../../assets/images'
import Badge from 'react-bootstrap/Badge'
import styled from 'styled-components'
import {
  primaryBgColor,
  quaternaryBgColor,
  primaryBgColorHover,
  shadow3,
} from '../../assets/js/variables'

const About = () => {
  return (
    <Wrapper>
      <section className="about-section section" id="about">
        <h1 className="about-heading">
          Nhà sách{' '}
          <Badge className="about-badge">
            <span>trực tuyến</span>
          </Badge>
        </h1>
        <div className="about-container general-container">
          <div className="about-img">
            <img src={aboutImage} alt="about image" />
          </div>
          <div className="describe-container">
            <h3>We love book</h3>
            <p className="text-justify">
              Nhà sách trực tuyến của chúng tôi cung cấp hàng ngàn tựa sách đa
              dạng, đáp ứng mọi nhu cầu đọc sách của bạn. Từ tiểu thuyết đến
              sách khoa học, mọi thứ đều có sẵn chỉ với một cú nhấp chuột.
            </p>
            <p className="text-justify">
              Với mục tiêu mang tri thức đến gần hơn với mọi người, chúng tôi
              cam kết mang đến dịch vụ chất lượng và sự hài lòng tuyệt đối cho
              khách hàng. Hãy khám phá thế giới sách ngay hôm nay!
            </p>
            <button className="general-btn">read more</button>
          </div>
        </div>
      </section>
    </Wrapper>
  )
}
export default About

const Wrapper = styled.section`
  .section {
    padding-top: 2rem;
    padding-bottom: 3rem;
    width: 100%;
  }

  .section .about-heading {
    font-size: 2.5rem;
    margin-bottom: 3.5rem;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.25rem;
    font-weight: bold;
    color: ${primaryBgColor};
  }

  .section .about-heading .about-badge {
    background-color: ${primaryBgColor} !important;
  }

  .section .about-heading .about-badge span {
    color: ${quaternaryBgColor};
  }

  .general-container {
    display: flex;
    width: 95vw;
    margin: auto;
    justify-content: space-between;
    max-width: 1170px;
    flex-wrap: wrap;
  }

  .about-section .about-container .about-img {
    position: relative;
    flex: 0 0 calc(50% - 2rem);
    box-shadow: ${shadow3};
  }

  .about-section .about-container .about-img img {
    overflow: clip;
    width: 100%;
    object-fit: cover;
  }

  @media screen and (min-width: 1170px) {
    .about-section .about-container .about-img::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: -1;
      bottom: 1.5rem;
      right: 1.5rem;
      border: 0.5rem solid ${primaryBgColor};
      box-sizing: border-box;
    }
  }

  .about-section .about-container .describe-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 0 0 calc(50% - 2rem);
  }

  .about-section .about-container .describe-container h3 {
    font-size: 1.75rem;
    text-transform: capitalize;
    letter-spacing: 0.25rem;
    margin-bottom: 0.75rem;
  }

  .about-section .about-container .describe-container p {
    letter-spacing: 0;
    margin-bottom: 1.25rem;
    text-align: left;
  }

  @media (max-width: 992px) {
    .about-section .about-container {
      flex-direction: column;
      width: 90vw;
    }
  }

  .general-btn {
    font-size: 0.875rem;
    padding: 0.375rem 0.75rem;
    border: 2px solid ${primaryBgColor};
    background-color: ${primaryBgColor};
    line-height: 21px;
    color: ${quaternaryBgColor};
  }

  .general-btn:hover {
    cursor: pointer;
    background-color: ${primaryBgColorHover};
    color: #fff;
    border-color: ${primaryBgColorHover};
  }
`

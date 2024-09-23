import '../../assets/scss/About.scss'
import { aboutImage } from '../../assets/images'
import Badge from 'react-bootstrap/Badge'

const About = () => {
  return (
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
            dạng, đáp ứng mọi nhu cầu đọc sách của bạn. Từ tiểu thuyết đến sách
            khoa học, mọi thứ đều có sẵn chỉ với một cú nhấp chuột.
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
  )
}
export default About
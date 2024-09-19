import '../../assets/scss/About.scss'
import { aboutImage } from '../../assets/images'
import Badge from 'react-bootstrap/Badge'

const About = () => {
  return (
    <section className="about-section section" id="about">
      <h1 className="about-heading">
        about{' '}
        <Badge className='about-badge'>
          <span>us</span>
        </Badge>
      </h1>
      <div className="about-container general-container">
        <div className="about-img">
          <img src={aboutImage} alt="about image" />
        </div>
        <div className="describe-container">
          <h3>We love book</h3>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur
            quisquam harum nam cumque temporibus explicabo dolorum sapiente odio
            unde dolor?
          </p>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur
            quisquam harum nam cumque temporibus explicabo dolorum sapiente odio
            unde dolor?
          </p>
          <button className="general-btn">read more</button>
        </div>
      </div>
    </section>
  )
}
export default About
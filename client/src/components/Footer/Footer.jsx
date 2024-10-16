
import FooterInput from './FooterInput'
import FooterPageBtn from './FooterPageBtn'
import FooterFollowBtn from './FooterFollowBtn'
import FooterInfoBtn from './FooterInfoBtn'
import { logo } from '../../assets/images'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
  primaryBgColor,
  quaternaryBgColor,
  quaternaryBgColorHover,
  primaryBgColorHover,
} from '../../assets/js/variables'

const Footer = () => {
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])
  return (
    <Wrapper>
      <div className="footer">
        <div className="d-flex flex-row justify-content-around align-items-center footer-contact">
          <FooterInput />
          <FooterPageBtn />
          <FooterFollowBtn />
        </div>
        <div className="d-flex flex-row gap-lg-5 justify-content-around align-items-center segment me-3">
          <FooterInfoBtn />
          <img src={logo} alt="logo" height="150px" />
          <p className="text-center m-0 ms-lg-4 right-line">
            &copy; {year}, All Rights Reserved
          </p>
        </div>
      </div>
    </Wrapper>
  )
}
const Wrapper = styled.section`
position: absolute;

  .footer {
    background-color: ${primaryBgColor};
    padding: 30px 60px;
    width: 100vw;
  }
  .footer .footer-contact {
    border-bottom: 1px solid ${primaryBgColorHover};
    padding-bottom: 2rem;
  }
  .footer .follow-btn {
    background-color: ${quaternaryBgColor};
    color: ${primaryBgColor};
    border: transparent;
    height: 40px;
    text-align: center;
    line-height: 0.5rem;
  }
  .footer .follow-btn:hover,
  .footer .follow-btn:active {
    background-color: ${quaternaryBgColorHover} !important;
  }

  .footer .page-btn .btn,
  .footer .info-btn .btn {
    color: #e0a75e;
  }
  .footer .page-btn .btn:active,
  .footer .info-btn .btn:active {
    color: #e0a75e;
    background-color: ${primaryBgColorHover};
  }
  .footer .right-line {
    color: #e0a75e;
  }

  form .form-control {
    border-radius: 0.375rem 0 0 0.375rem;
    background-color: ${quaternaryBgColor};
    border: transparent;
    margin-bottom: 1rem;
    height: 36px;
  }
  form .form-control:focus {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    background-color: ${quaternaryBgColorHover};
  }
  form .btn {
    border-radius: 0 0.375rem 0.375rem 0;
    background-color: ${quaternaryBgColor};
    border: transparent;
    text-align: center;
    line-height: 1rem;
    height: 36px;
    font-size: 1.5rem;
    color: ${primaryBgColor};
  }
  form .btn:hover {
    background-color: ${quaternaryBgColorHover};
  }
`
export default Footer

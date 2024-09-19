import React from 'react'
import styled from 'styled-components'
import { quaternaryBgColor, primaryBgColorHover } from '../assets/js/variables'

const SectionTitle = ({ text }) => {
  return (
    <Wrapper>
      <div className="info-heading">
        <h2>{text}</h2>
      </div>
    </Wrapper>
  )
}

export default SectionTitle

const Wrapper = styled.section`
  .info-heading {
    width: 100%;
    background-color: ${primaryBgColorHover};
    padding: 0.75rem 0;
  }
  h2 {
    color: ${quaternaryBgColor};
    font-weight: bold;
    margin: 0 0 0 5rem;
  }
`

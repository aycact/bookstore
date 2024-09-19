import React from 'react'
import Spinner from 'react-bootstrap/Spinner'
import styled from 'styled-components'

const Loading = () => {
  return (
    <Wrapper>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Wrapper>
  )
}

export default Loading

const Wrapper = styled.section`
  width: 100vw;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

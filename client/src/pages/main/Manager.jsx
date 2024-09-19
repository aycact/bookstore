import React from 'react'
import styled from 'styled-components'
import { AddAttribute, AddBook } from '../../components'



const Manager = () => {
  return (
    <Wrapper>
      <AddBook/>
      <AddAttribute/>
    </Wrapper>
  )
}

export default Manager

const Wrapper = styled.section`
  
`

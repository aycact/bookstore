import React from 'react'
import styled from 'styled-components'
import { AddAttribute, AddBook } from '../../components'
import { useState } from 'react'

const Manager = () => {
  const [dataUpdated, setDataUpdated] = useState(false)
   const handleDataUpdate = () => {
     setDataUpdated(!dataUpdated) // Thay đổi state để trigger rerender
   }
  return (
    <Wrapper>
      <AddBook dataUpdated={dataUpdated} />
      <AddAttribute onAddData={handleDataUpdate} />
    </Wrapper>
  )
}

export default Manager

const Wrapper = styled.section`
  
`

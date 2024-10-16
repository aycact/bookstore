import { AddAttribute, AddBook } from '../../../components'
import { useState } from 'react'
import React from 'react'

const CreationPage = () => {
  const [dataUpdated, setDataUpdated] = useState(false)
  const handleDataUpdate = () => {
    setDataUpdated(!dataUpdated) // Thay đổi state để trigger rerender
  }
  return (
    <div>
      <AddBook dataUpdated={dataUpdated} />
      <AddAttribute onAddData={handleDataUpdate} />
    </div>
  )
}

export default CreationPage

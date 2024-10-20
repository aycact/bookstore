import { AddAttribute, AddBook } from '../../../components'
import { useState } from 'react'
import React from 'react'
import { customFetch } from '../../../utils/axios'

const fetchCategories = () => {
  return {
    queryKey: ['categories'],
    queryFn: () => customFetch.get('/categories'),
  }
}

const fetchPublishers = () => {
  return {
    queryKey: ['publishers'],
    queryFn: () => customFetch.get('/publishers'),
  }
}

const fetchAuthors = () => {
  return {
    queryKey: ['authors'],
    queryFn: () => customFetch.get('/authors'),
  }
}

export const loader = (queryClient) => async () => {
  const [responseAuthors, responseCategories, responsePublisher] =
    await Promise.all([
      queryClient.ensureQueryData(fetchAuthors()),
      queryClient.ensureQueryData(fetchCategories()),
      queryClient.ensureQueryData(fetchPublishers()),
    ])

  const authors = responseAuthors?.data?.authors || []
  const categories = responseCategories?.data?.categories || []
  const publishers = responsePublisher?.data?.publishers || []

  return { authors, categories, publishers }
}

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

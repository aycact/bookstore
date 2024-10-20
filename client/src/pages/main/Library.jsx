import React from 'react'
import { LibraryContainer, MyBreadCrumb } from '../../components'
import { customFetch } from '../../utils/axios'
import styled from 'styled-components'
import { quaternaryBgColorLight } from '../../assets/js/variables'
import { useLoaderData } from 'react-router-dom'

const url = '/books'

const allBookQuery = (queryParams) => {
  const { search, category, publisher, author, sort, page } = queryParams
  return {
    queryKey: [
      'books',
      search ?? '',
      category ?? '',
      publisher ?? '',
      author ?? '',
      sort ?? 'latest',
      page ?? 1,
    ],
    queryFn: () => customFetch(url, { params: queryParams }),
  }
}

const allCategoriesQuery = () => {
  return {
    queryKey: ['categories'],
    queryFn: () => customFetch('/categories'),
  }
}

const allPublishersQuery = () => {
  return {
    queryKey: ['publishers'],
    queryFn: () => customFetch('/publishers'),
  }
}

export const loader =
  (queryClient) =>
  async () => {
    const [responseCategories, responsePublishers] = await Promise.all([
      queryClient.ensureQueryData(allCategoriesQuery()),
      queryClient.ensureQueryData(allPublishersQuery()),
    ])
   
    const categories = responseCategories?.data?.categories || []
    const publishers = responsePublishers?.data?.publishers || []
    return { categories, publishers }
  }

const Library = () => {
  const breadcrumbItems = [
    { label: 'Trang chủ', path: '/', active: false },
    { label: 'Sách', path: '/library', active: true },
  ]

  return (
    <Wrapper>
      <div className="library">
        <MyBreadCrumb breadcrumbItems={breadcrumbItems} />
        <LibraryContainer/>
      </div>
    </Wrapper>
  )
}

export default Library

const Wrapper = styled.section`
  .library .library-container {
    background-color: ${quaternaryBgColorLight};
    padding: 0 5rem;
  }
`

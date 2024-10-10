import React from 'react'
import { LibraryContainer, MyBreadCrumb } from '../../components'
import { customFetch } from '../../utils/axios'
import styled from 'styled-components'
import { quaternaryBgColorLight } from '../../assets/js/variables'

const url = '/books'

const allProductsQuery = (queryParams) => {
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

export const loader =
  (queryClient) =>
  async ({ request }) => {
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ])
    // new URL() trả về object dạng URL
    // searchParams trả về object dạng URLSearchParams
    // entries() trả về Iterator và để kiểm tra Iterator ta dung Spread Syntax
    const response = await queryClient.ensureQueryData(allProductsQuery(params))
    const books = response.data.books
    const meta = response.data.meta
    return { books, meta, params }
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
        <LibraryContainer />
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

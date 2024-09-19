import React from 'react'
import { LibraryContainer, MyBreadCrumb } from '../../components'
import '../../assets/scss/Library.scss'
import { customFetch } from '../../utils/axios'

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
    { label: 'Home', path: '/', active: false },
    { label: 'Library', path: '/library', active: true },
  ]
  return (
    <div className="library">
      <MyBreadCrumb breadcrumbItems={breadcrumbItems} />
      <LibraryContainer />
    </div>
  )
}

export default Library

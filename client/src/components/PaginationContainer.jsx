import styled from 'styled-components'
import {
  quaternaryBgColor,
  boldTextColor,
  quaternaryBgColorHover,
} from '../assets/js/variables'
import { useDispatch } from 'react-redux'

import Pagination from 'react-bootstrap/Pagination'

const PaginationContainer = ({ meta, handleChange }) => {
  const dispatch = useDispatch()

  const handlePageChange = (pageNumber) => {
    dispatch(handleChange({ name: 'page', value: pageNumber }))
    // scrollToSection('breadcrumb')
  }

  // const scrollToSection = (sectionId) => {
  //   document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' })
  // }

  const { numOfPages, page } = meta
  const pages = Array.from({ length: numOfPages }, (_, i) => i + 1)

  if (numOfPages < 2) return null // nếu số trang bé hơn 2 thì ko hiển thị pagination container
  if (numOfPages <= 6)
    return (
      <Wrapper>
        <Pagination>
          {pages.map((pageNumber) => {
            return (
              <Pagination.Item
                key={pageNumber}
                active={pageNumber === page}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </Pagination.Item>
            )
          })}
        </Pagination>
      </Wrapper>
    )

  const adjacentPages = []
  for (let i = page - 2; i <= page + 2; i++) adjacentPages.push(i)
  const firstPages = [1, 2, 3, 4, 5, 6]
  const lastPages = []
  for (let i = pages.length; i >= pages.length - 5; i--) lastPages.unshift(i)

  return (
    <Wrapper>
      <Pagination>
        <Pagination.First onClick={() => handlePageChange(1)} />
        {page > 3 && page < pages.length - 2 ? (
          <>
            <Pagination.Ellipsis />
            {adjacentPages.map((pageNumber) => {
              return (
                <Pagination.Item
                  key={pageNumber}
                  active={pageNumber === page}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </Pagination.Item>
              )
            })}
            <Pagination.Ellipsis />
          </>
        ) : (
          <>
            {page <= 3 ? (
              <>
                {firstPages.map((pageNumber) => {
                  return (
                    <Pagination.Item
                      key={pageNumber}
                      active={pageNumber === page}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </Pagination.Item>
                  )
                })}
                <Pagination.Ellipsis />
              </>
            ) : (
              <>
                <Pagination.Ellipsis />
                {lastPages.map((pageNumber) => {
                  return (
                    <Pagination.Item
                      key={pageNumber}
                      active={pageNumber === page}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </Pagination.Item>
                  )
                })}
              </>
            )}
          </>
        )}
        <Pagination.Last onClick={() => handlePageChange(pages.length)} />
      </Pagination>
    </Wrapper>
  )
}

export default PaginationContainer

const Wrapper = styled.section`
  .pagination {
    margin-top: 2rem;
    padding: 0 40px;
    justify-content: end;
  }
  .active > .page-link {
    background-color: ${quaternaryBgColorHover};
    border-color: transparent;
  }
  .page-link {
    background-color: ${quaternaryBgColor};
    color: ${boldTextColor};
  }
`

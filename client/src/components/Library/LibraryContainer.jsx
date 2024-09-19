import BookList from './BookList'
import Sidebar from '../Sidebar/Sidebar'
import styled from 'styled-components'

const LibraryContainer = () => {

  return (
    <Wrapper>
      <div className="library-container d-flex flex-row">
        <Sidebar />
        <BookList/>
      </div>
    </Wrapper>
  )
}
export default LibraryContainer


const Wrapper = styled.section`
h5 {
  text-transform: capitalize;
}
  .book-list {
    width: 100%;
  }
`

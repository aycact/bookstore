import styled from 'styled-components'
import { formatPrice } from '../../utils'
import { boldTextColor, shadow1 } from '../../assets/js/variables'

const OrderItemsList = ({ itemList }) => {
  return (
    <Wrapper>
      <div className="container">
        {itemList.map((item) => {
          return (
            <div className="row book-container" key={item.bookID}>
              <div className="col text-start ps-0">
                <img
                  src={item.book_img}
                  alt={'book image'}
                  className="book-img"
                />
              </div>
              <div className="col-6">
                <h3>{item.title}</h3>
                <h4>{item.author}</h4>
              </div>
              <div className="col text-center">
                <h5>x{item.amount}</h5>
              </div>
              <div className="col text-end">{formatPrice(item.price)}</div>
            </div>
          )
        })}
      </div>
    </Wrapper>
  )
}
export default OrderItemsList

const Wrapper = styled.section`
box-shadow: ${shadow1};
border-radius: 1rem;
padding: 1rem;
background-color: white;
  .book-img {
    width: 8rem;
    border-radius: 0.5rem;
  }
  h3 {
    font-weight: bold;
  }

  h3,
  h4 {
    font-size: 1rem;
  }
  .container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: space-between;
  }
  .book-container {
    border-bottom: 0.5px solid gray;
    padding-bottom: 1rem;
  }
`

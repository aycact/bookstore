import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import { formatPrice } from '../../utils'
import {
  quaternaryBgColorLight,
  quaternaryBgColor,
  textColor,
  boldTextColor,
} from '../../assets/js/variables'

const CartTotals = () => {
  const { cartTotal, shipping, tax, orderTotal } = useSelector(
    (store) => store.cart
  )
  return (
    <Wrapper>
      <Card>
        <Card.Body>
          <ListGroup>
            <ListGroup.Item>
              <span className="label">Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="label">Shipping</span>
              <span>{formatPrice(shipping)}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="label">Tax</span>
              <span>{formatPrice(tax)}</span>
            </ListGroup.Item>
            <ListGroup.Item className="last-item">
              <span className="label">Order Total</span>
              <span>{formatPrice(orderTotal)}</span>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </Wrapper>
  )
}
export default CartTotals

const Wrapper = styled.section`
margin-bottom: 1rem;
  .card {
    background: ${quaternaryBgColorLight};
  }
  .list-group-item {
    display: flex;
    justify-content: space-between;
    background: ${quaternaryBgColorLight};
    color: ${boldTextColor};
  }
  .last-item {
    background: ${quaternaryBgColor};
  }
  .label {
    font-weight: 500;
  }
`

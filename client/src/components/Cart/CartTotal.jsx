import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import { formatPrice } from '../../utils'
import {
  quaternaryBgColorLight,
  quaternaryBgColor,
  boldTextColor,
} from '../../assets/js/variables'

const CartTotal = ({ shippingFee }) => {
  const { cartTotal, shipping, orderTotal } = useSelector(
    (store) => store.cart
  )
  return (
    <Wrapper>
      <Card>
        <Card.Body>
          <ListGroup>
            <ListGroup.Item>
              <span className="label">Tổng tiền hàng</span>
              <span>{formatPrice(cartTotal)}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="label">Phí ship</span>
              <span>{formatPrice(shipping)}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="label">Thuế</span>
              <span>{formatPrice(0)}</span>
            </ListGroup.Item>
            <ListGroup.Item className="last-item">
              <span className="label">Tổng thanh toán</span>
              <span>{formatPrice(orderTotal)}</span>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </Wrapper>
  )
}
export default CartTotal

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

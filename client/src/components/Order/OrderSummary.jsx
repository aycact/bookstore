import React from 'react'
import styled from 'styled-components'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import { formatPrice } from '../../utils'
import {
  quaternaryBgColorLight,
  boldTextColor,
} from '../../assets/js/variables'

const OrderSummary = () => {
  return (
    <Wrapper>
      <Card>
        <Card.Header>
          <h5>Thông tin đơn hàng</h5>
        </Card.Header>
        <Card.Body>
          <ListGroup>
            <ListGroup.Item>
              <span className="label">Tổng tiền hàng</span>
              <span>{formatPrice(12)}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="label">Phí ship</span>
              <span>{formatPrice(2)}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="label">Thuế</span>
              <span>{formatPrice(3)}</span>
            </ListGroup.Item>
            <ListGroup.Item className="last-item">
              <span className="label">Tổng thanh toán</span>
              <span>{formatPrice(23)}</span>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </Wrapper>
  )
}

export default OrderSummary

const Wrapper = styled.section`
  .card {
  }
  .list-group-item {
    display: flex;
    justify-content: space-between;
    color: ${boldTextColor};
  }
  .last-item {
    background: ${quaternaryBgColorLight};
  }
  .label {
    font-weight: 500;
  }
`

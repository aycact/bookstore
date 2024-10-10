import { useDispatch } from 'react-redux'
import { removeItem, editItem } from '../../features/cart/cartSlice'
import { SelectInput } from '../../components'
import styled from 'styled-components'
import {
  textColor,
  primaryBgColorHover,
  quaternaryBgColor,
  quaternaryBgColorLight,
  shadow1,
} from '../../assets/js/variables'
import { formatPrice } from '../../utils'

const CartItem = ({ cartItem }) => {
  const dispatch = useDispatch()
  const { cartId, title, price, image, amount, author, available_copies } =
    cartItem
  // function
  const removeItemFromTheCart = () => {
    dispatch(removeItem({ cartId }))
  }
  const handleAmount = (e) => {
    dispatch(editItem({ cartId, amount: e.target.value }))
  }

  const list = Array.from({ length: available_copies }, (_, i) => ({
    id: i + 1,
    name: i + 1,
  }))

  return (
    <Wrapper key={cartId} className="container">
      <div className="row">
        <div className="col-6 container">
          <div className="row">
            {/* IMAGE */}
            <img
              src={image}
              alt={title}
              className="cart-item-img col rounded-5"
            />
            {/* INFORMATION */}
            <div className="info col">
              <h3>{title}</h3>
              <h4>{author.name}</h4>
            </div>
          </div>
        </div>
        {/* AMOUNT */}
        <div className="col-3 align-content-center">
          <SelectInput
            name={'Amount'}
            defaultValue={amount}
            list={list}
            handleChoose={handleAmount}
          />
          <a className="remove-btn" onClick={removeItemFromTheCart}>
            Xóa
          </a>
        </div>
        <h3 className="col-3 price-tag text-center">{`${formatPrice(price)}`}</h3>
      </div>
    </Wrapper>
  )
}
export default CartItem

const Wrapper = styled.article`
  border-top: solid 2px ${primaryBgColorHover};
  padding: 1rem 0rem;
  .cart-item-img {
    width: 8rem;
  }
  .info {
  }
  h3 {
    font-weight: bold;
  }

  h3,
  h4 {
    font-size: 1rem;
  }

  .remove-btn {
    color: ${textColor};
    text-decoration: none;
    cursor: pointer;
    background-color: ${quaternaryBgColorLight};
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    box-shadow: ${shadow1};
    font-weight: 600;
  }

  .select-label {
    font-size: 1rem;
    color: ${textColor};
  }
  .select-input {
    background-color: ${quaternaryBgColorLight};
  }
`

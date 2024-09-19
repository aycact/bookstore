import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const defaultState = {
  cartItems: [],
  numItemsInCart: 0,
  cartTotal: 0,
  shipping: 5,
  tax: 0,
  orderTotal: 0,
}

const getCartFromCurrentState = () => {
  return JSON.parse(localStorage.getItem('cart')) || defaultState
}


const cartSlice = createSlice({
  name: 'cart',
  initialState: getCartFromCurrentState(),
  reducers: {
    addItem: (state, action) => {
      //extract data
      const book = action.payload
      // check book is already in cart
      const bookIsAlreadyExist = state.cartItems.find(
        (item) => item.cartId === book.cartId
      )

      if (bookIsAlreadyExist) bookIsAlreadyExist.amount += book.amount
      else state.cartItems.push(book)

      state.numItemsInCart += book.amount
      state.cartTotal += book.price * book.amount
      // use cartSlice other function
      cartSlice.caseReducers.calculateTotals(state)
      toast.success('Item added to cart')
    },
    calculateTotals: (state) => {
      state.tax = state.cartTotal * 0.1
      state.orderTotal = state.cartTotal + state.shipping + state.tax
      localStorage.setItem('cart', JSON.stringify(state))
    },
    clearCart: () => {
      localStorage.setItem('cart', JSON.stringify(defaultState))
      return defaultState
    },
    removeItem: (state, action) => {
      // extract data
      const { cartId } = action.payload
      const book = state.cartItems.find((item) => item.cartId === cartId)

      state.cartItems = state.cartItems.filter((item) => item.cartId !== cartId)
      state.cartTotal -= book.price * book.amount
      state.numItemsInCart -= book.amount
      cartSlice.caseReducers.calculateTotals(state)
      toast.error('Item removed from cart')
    },
    editItem: (state, action) => {
      const { cartId, amount } = action.payload
      const item = state.cartItems.find((i) => i.cartId === cartId)

      // thỏa mãn cả trường hợp tăng hoặc giảm amount
      state.numItemsInCart += amount - item.amount
      state.cartTotal += item.price * (amount - item.amount)
      item.amount = amount

      cartSlice.caseReducers.calculateTotals(state)
      toast.success('cart updated')
    },
  },
})

export const { addItem, removeItem, clearCart, editItem } = cartSlice.actions
export default cartSlice.reducer

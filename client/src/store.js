import { configureStore } from '@reduxjs/toolkit'
import booksSlice from './features/books/booksSlice'
import userSlice from './features/users/userSlice'
import cartSlice from './features/cart/cartSlice'
import orderSlice from './features/orders/orderSlice'

const store = configureStore({
  reducer: {
    allBooks: booksSlice,
    user: userSlice,
    cart: cartSlice,
    order: orderSlice
  },
})

export default store
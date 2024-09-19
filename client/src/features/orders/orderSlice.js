import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { getUserOrderThunk, createOrderThunk, updateOrderThunk } from './orderThunk'


const initialState = {
  isLoading: true,
  orders: [],
  totalOrders: 0,
  numOfPages: 1,
  page: 1,
}

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (cart, thunkAPI) => {
    return createOrderThunk('/orders', cart, thunkAPI)
  }
)

export const updateOrder = createAsyncThunk(
  'order/updateOrder',
  async (cart, thunkAPI) => {
    return updateOrderThunk('/order', cart, thunkAPI)
  }
)
export const getUserOrder = createAsyncThunk(
  'orders/getUserOrders',
  getUserOrderThunk
)

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    showLoading: (state) => {
      state.isLoading = true
    },
    hideLoading: (state) => {
      state.isLoading = false
    },
    handleChange: (state, { payload: { name, value } }) => {
      state.page = 1
      state[name] = value
    },
    clearFilters: (state) => {
      return { ...state, ...initialState }
    },
    changePage: (state, { payload }) => {
      state.page = payload
    },
    clearUserOrderState: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createOrder.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.cart = null
        toast.success('Order successfully')
      })
      .addCase(createOrder.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
      .addCase(updateOrder.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateOrder.fulfilled, (state, { payload }) => {
        state.isLoading = false
        toast.success('Paid successfully')
      })
      .addCase(updateOrder.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
      .addCase(getUserOrder.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUserOrder.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.orders = payload.orders
        state.numOfPages = payload.meta.numOfPages
        state.totalOrders = payload.meta.totalOrders
      })
      .addCase(getUserOrder.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
  },
})

export const {
  showLoading,
  hideLoading,
  handleChange,
  changePage,
  clearUserOrderState,
} = orderSlice.actions
export default orderSlice.reducer

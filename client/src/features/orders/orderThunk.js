import { customFetch, checkForUnauthorizedResponse } from '../../utils/axios'

export const getUserOrderThunk = async (_, thunkAPI) => {
  const { page } = thunkAPI.getState().order
  try {
    const resp = await customFetch.get('/orders/showAllMyOrders', {
      params: { page },
    })
    return resp.data
  } catch (e) {
    return checkForUnauthorizedResponse(error, thunkAPI)
  }
}

export const createOrderThunk = async (url, order, thunkAPI) => {
  try {
    const resp = await customFetch.post(url, order)
    return resp.data
  } catch (error) {
    const message = error.response?.data?.msg || 'Order failed!'
    return thunkAPI.rejectWithValue(message)
  }
}

export const updateOrderThunk = async (url, order, thunkAPI) => {
  try {
    const resp = await customFetch.patch(url, order)
    return resp.data
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI)
  }
}


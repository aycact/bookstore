import axios from 'axios'
import { clearStore, logoutUser } from '../features/users/userSlice'

const bookUrl = import.meta.env.VITE_APP_BASE_URL

export const customFetch = axios.create({
  baseURL: bookUrl,
  withCredentials: true,
})

export const checkForUnauthorizedResponse = (error, thunkAPI) => {
  if (error.response.status === 401) {
    thunkAPI.dispatch(clearStore())
    return thunkAPI.rejectWithValue('Unauthorized! Logging Out...')
  }
  return thunkAPI.rejectWithValue(error.response.data.msg)
}

export const checkForForbiddenResponse = (error, thunkAPI) => {
  if (error.response.status === 403) {
    thunkAPI.dispatch(clearStore())
    return thunkAPI.rejectWithValue("You are not allowed to use this service!")
  }
  return thunkAPI.rejectWithValue(error.response.data.msg)
}

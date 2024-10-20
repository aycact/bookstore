import { checkForForbiddenResponse, customFetch } from '../../utils/axios'

export const getAllCouponsThunk = async (_, thunkAPI) => {
  const { search, status, applicable_publisher, sort, page } =
    thunkAPI.getState().allCoupons
  const queryParams = {
    search,
    status,
    applicable_publisher,
    sort,
    page,
  }
  try {
    const resp = await customFetch('/coupons', { params: queryParams })
    return resp.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg)
  }
}

export const addCouponThunk = async function (url, coupon, thunkAPI) {
  const { start_date, expiration_date } = coupon
  const startDate = `${start_date.$M + 1}/${start_date.$D}/${start_date.$y}`
  const expirationDate = `${expiration_date.$M + 1}/${expiration_date.$D}/${
    expiration_date.$y
  }`
  coupon.start_date = startDate
  coupon.expiration_date = expirationDate
  console.log(coupon);
  
  try {
    const resp = await customFetch.post(url, coupon)
    return resp.data
  } catch (error) {
    console.log(error);
    return checkForForbiddenResponse(error, thunkAPI)
  }
}

export const updateCouponThunk = async function (url, coupon, thunkAPI) {
  try {
    const resp = await customFetch.patch(url, coupon)
    return resp.data
  } catch (error) {
    console.log(error)
    return checkForForbiddenResponse(error, thunkAPI)
  }
}
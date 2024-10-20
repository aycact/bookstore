import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { getAllCouponsThunk, addCouponThunk, updateCouponThunk } from './couponThunk'

const initialFiltersState = {
  search: '',
  status: 'active',
  applicable_publisher: '',
  sort: 'mới nhất',
}

const initialState = {
  isLoading: false,
  coupons: [],
  totalCoupons: 0,
  numOfPages: 1,
  page: 1,
  ...initialFiltersState,
}

export const getAllCoupons = createAsyncThunk(
  'allCoupons/getCoupons',
  getAllCouponsThunk
)
export const addCoupon = createAsyncThunk(
  'coupons/addCoupon',
  async (coupon, thunkAPI) => {
    return addCouponThunk('/coupons', coupon, thunkAPI)
  }
)
export const updateCoupon = createAsyncThunk(
  'coupons/updateCoupon',
  async (coupon, thunkAPI) => {
    return updateCouponThunk('/coupons', coupon, thunkAPI)
  }
)

const couponsSlice = createSlice({
  name: 'allCoupons',
  initialState,
  reducers: {
    showLoading: (state) => {
      state.isLoading = true
    },
    hideLoading: (state) => {
      state.isLoading = false
    },
    handleChangeCouponFilter: (state, { payload: { name, value } }) => {
      state.page = 1
      state[name] = value
    },
    clearFilters: (state) => {
      return { ...state, ...initialFiltersState }
    },
    changePage: (state, { payload }) => {
      state.page = payload
    },
    clearAllCouponsState: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCoupons.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllCoupons.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.coupons = payload.coupons
        state.numOfPages = payload.meta.numOfPages
        state.totalCoupons = payload.meta.totalCoupons
      })
      .addCase(getAllCoupons.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
      .addCase(addCoupon.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addCoupon.fulfilled, (state) => {
        state.isLoading = false
        toast.success('Thêm coupon thành công')
      })
      .addCase(addCoupon.rejected, (state, {payload}) => {
        state.isLoading = false
        toast.error('Thêm coupon thất bại')
      })
      .addCase(updateCoupon.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateCoupon.fulfilled, (state) => {
        state.isLoading = false
        toast.success('Cập nhật giá trị coupon thành công')
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.isLoading = false
        toast.error(action.payload)
      })
  },
})

export const {
  showLoading,
  hideLoading,
  handleChangeCouponFilter,
  clearFilters,
  changePage,
  clearAllCouponsState,
} = couponsSlice.actions
export default couponsSlice.reducer

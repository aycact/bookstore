import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { getAllBooksThunk, addBookThunk } from './booksThunk'

const initialFiltersState = {
  search: '',
  category: '',
  publisher: '',
  author: '',
  sort: 'latest',
}

const initialState = {
  isLoading: false,
  books: [],
  totalBooks: 0,
  numOfPages: 1,
  page: 1,
  ...initialFiltersState,
}

export const getAllBooks = createAsyncThunk(
  'allBooks/getBooks',
  getAllBooksThunk
)
export const addBook = createAsyncThunk(
  'books/addBook',
  async (book, thunkAPI) => {
    return addBookThunk('/books', book, thunkAPI)
  }
)

const booksSlice = createSlice({
  name: 'allBooks',
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
      return { ...state, ...initialFiltersState }
    },
    changePage: (state, { payload }) => {
      state.page = payload
    },
    clearAllBooksState: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllBooks.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllBooks.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.books = payload.books
        state.numOfPages = payload.meta.numOfPages
        state.totalBooks = payload.meta.totalBooks
      })
      .addCase(getAllBooks.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
      .addCase(addBook.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addBook.fulfilled, (state) => {
        state.isLoading = false
        toast.success('Thêm sách thành công')
      })
      .addCase(addBook.rejected, (state) => {
        state.isLoading = false
        toast.error('Thêm sách thất bại')
      })
  },
})

export const {
  showLoading,
  hideLoading,
  handleChange,
  clearFilters,
  changePage,
  clearAllBooksState,
} = booksSlice.actions
export default booksSlice.reducer

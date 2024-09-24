import { checkForForbiddenResponse, customFetch } from '../../utils/axios'

export const getAllBooksThunk = async (_, thunkAPI) => {
  const { search, category, publisher, author, sort, page } =
    thunkAPI.getState().allBooks
  const queryParams = {
    search,
    category,
    publisher,
    author,
    sort,
    page,
  }
  try {
    const resp = await customFetch('/books', { params: queryParams })
    return resp.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg)
  }
}

export const addBookThunk = async function (url, book, thunkAPI) {
  const { publication_date } = book
  const publicationDate = `${publication_date.$M + 1}/${publication_date.$D}/${
    publication_date.$y
  }`
  try {
    const formData = new FormData()
    formData.append('book_img', book.book_img)
    formData.append('title', book.title)
    formData.append('publication_date', publicationDate)
    formData.append('page_number', book.page_number)
    formData.append('available_copies', book.available_copies)
    formData.append('price', book.price)
    formData.append('category_id', book.category_id)
    formData.append('author_id', book.author_id)
    formData.append('publisher_id', book.publisher_id)
    formData.append('description', book.description)
    const resp = await customFetch.post(url, formData)
    return resp.data
  } catch (error) {
    return checkForForbiddenResponse(error, thunkAPI)
  }
}

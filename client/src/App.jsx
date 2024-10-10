import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {
  SharedLayout,
  Home,
  About,
  Library,
  Register,
  Checkout,
  SingleBook,
  SingleAuthor,
  Cart,
  Order,
  UserInfo,
  Manager,
  SingleOrder,
} from './pages/main'
import VerifyEmail from './pages/VerifyEmail'
import { ProtectedRoute, Error } from './pages'
import { ErrorElement } from './components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { loader as libraryLoader } from './pages/main/Library'
import { loader as verifyEmailLoader } from './pages/VerifyEmail'
import { loader as singleBookLoader } from './pages/main/SingleBook'
import { loader as singleAuthorLoader } from './pages/main/SingleAuthor'
import { loader as newBookLoader } from './pages/main/Home'
import { loader as singleUserOrder } from './pages/main/SingleOrder'
import store from './store'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <SharedLayout />,
    children: [
      {
        index: true,
        element: <Home />,
        loader: newBookLoader,
        errorElement: <ErrorElement />,
      },
      { path: 'about', element: <About /> },
      {
        path: 'library',
        element: <Library />,
        loader: libraryLoader(queryClient),
      },
      {
        path: 'library/:id',
        element: <SingleBook />,
        loader: singleBookLoader(queryClient),
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: 'order',
        element: (
          <ProtectedRoute>
            <Order />
          </ProtectedRoute>
        ),
      },
      {
        path: 'order/:id',
        element: (
          <ProtectedRoute>
            <SingleOrder />
          </ProtectedRoute>
        ),
        loader: singleUserOrder(store, queryClient),
      },
      {
        path: 'author/:id',
        element: <SingleAuthor />,
        loader: singleAuthorLoader(queryClient),
      },
      {
        path: 'user',
        element: (
          <ProtectedRoute>
            <UserInfo />
          </ProtectedRoute>
        ),
      },
      {
        path: 'manager',
        element: (
          <ProtectedRoute>
            <Manager />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <Error />,
  },
  {
    path: '/user/verify-email',
    element: <VerifyEmail />,
    loader: verifyEmailLoader,
    errorElement: <Error />,
  },
])

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  )
}
export default App

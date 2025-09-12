import { createBrowserRouter } from 'react-router-dom'

import App from './App'

import AuthLayout from '../features/auth/AuthLayout'
import SignIn from '../features/auth/SignIn'
import SignUp from '../features/auth/SignUp'
import ProtectedRoute from '../features/auth/ProtectedRoute'

import Calendar from '../features/events/views/Calendar'
// import List

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          { index: true, element: <SignIn /> },
          { path: 'signIn', element: <SignIn /> },
          { path: 'signUp', element: <SignUp /> },
        ],
      },
      {
        path: 'events/calendar',
        element: (
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        ),
      },

      {
        path: '*',
        element: (
          <div className="text-center mt-20 text-2xl font-bold">
            404 - Page Not Found
            <p className="text-center mt-20 text-1xl font-bold">Home</p>
          </div>
        ),
      },
    ],
  },
])

export default router
import { Outlet, Link } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <Link to="/" className="block text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Home</h1>
        </Link>

        <Outlet />
      </div>
    </div>
  )
}

import { Toaster } from 'react-hot-toast'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {children}
      <Toaster position="top-center" />
    </div>
  )
} 
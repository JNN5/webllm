import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import HomePage from './pages/HomePage'
import './styles.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#14213d] via-[#1a2a4a] to-[#0f1b36]">
      <HomePage />
    </div>
  )
}

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
    },
  ],
  {
    basename: import.meta.env.PROD ? '/webllm' : undefined,
  },
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

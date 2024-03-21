import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.scss'
import './i18n/index'
import React from 'react'

const Loading = () => {
  return (
    <h1>Loading languages</h1>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.Suspense fallback={<Loading />}>
    <App />
  </React.Suspense>
)

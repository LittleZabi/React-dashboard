import Footer from "./Components/Footer"
import Header from "./Components/Header"
import Sidebar from "./Components/Sidebar"
import './styles/index.scss'
import Dashboard from "./pages/Dashboard"
import { Routes, Route } from "react-router-dom"
import Users from "./pages/Users"
import { StoreProvider } from "./context/store"
import Alert from "./Components/Alerts"
const App = () => {
  return (
    <StoreProvider>
      <div className="super-container color-white">
        <Alert />
        <header className='mt-1 mb-1 mx-4'>
          header view
        </header>
        <main className="h-full m-auto w-full page-size flex">
          <Sidebar />
          <div className="h-full m-auto fg-color rounded p-4 page-size w-4/5">
            <Header />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </StoreProvider>
  )
}

export default App

import Footer from "./Components/Footer"
import Header from "./Components/Header"
import Sidebar from "./Components/Sidebar"
import './styles/index.scss'
import Dashboard from "./pages/Dashboard"
import { Routes, Route } from "react-router-dom"
import Users from "./pages/Users"
import { StoreProvider } from "./context/store"
import Alert from "./Components/Alerts"
import { WEBSITE_NAME } from "./utilities/constant"
import Login from "./pages/login"
import { useState } from "react"
import { getCookies } from "./utilities/globals"
import Materials from "./pages/Materials"
import Sells from "./pages/Sells"
import Purchases from "./pages/Purchases"
const App = () => {
  let [User_, setUser_]: any = useState(getCookies('user'))
  return (
    <StoreProvider>
      <div className="super-container color-white">
        <Alert />
        <header className='mt-1 mb-1 mx-4'>
          <span style={{ fontSize: 12 }}>
            {new Date().getFullYear()} {WEBSITE_NAME} all right reserved. contact <a href="to:email@gmail.com">testemailadd@xyz.com</a> email address.
          </span>
        </header>
        <main className="h-full m-auto w-full page-size flex">
          {User_ ? (<>
            <Sidebar />
            <div className="h-full m-auto fg-color rounded p-4 page-size w-4/5">
              <Header />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/materials" element={<Materials />} />
                <Route path="/sells" element={<Sells />} />
                <Route path="/purchases" element={<Purchases />} />
              </Routes>
            </div>
          </>
          ) : <Login setUser_={setUser_} />}
        </main>
        <Footer />
      </div>
    </StoreProvider>
  )
}

export default App

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
import { Cookies } from "./utilities/globals"
import Materials from "./pages/Materials"
import Sells from "./pages/Sells"
import Purchases from "./pages/Purchases"
import Logout from "./pages/logout"
const App = () => {
  let user = Cookies.get('user')
  if (user) user = JSON.parse(user)
  let [User_, setUser_]: any = useState(user)
  return (
    <StoreProvider>
      <div className="super-container bg-gray-100 dark:bg-gray-900 color-white dark:color-black">
        <Alert />
        <header className='mt-1 mb-1 mx-4 text-center'>
          <span style={{ fontSize: 12 }} className="text-gray-900 dark:text-gray-100">
            {new Date().getFullYear()} {WEBSITE_NAME} all right reserved. contact <a href="to:email@gmail.com">testemailadd@xyz.com</a> email address.
          </span>
        </header>
        <main className="h-full m-auto w-full page-size flex">
          {User_ ? (<>
            <Sidebar />
            <div className="h-full m-auto rounded p-4 page-size w-4/5 bg-white dark:bg-gray-800">
              <Header />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/materials" element={<Materials />} />
                <Route path="/sells" element={<Sells />} />
                <Route path="/purchases" element={<Purchases />} />
                <Route path="/logout" element={<Logout />} />
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

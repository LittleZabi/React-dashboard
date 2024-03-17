import { Icon } from "@iconify/react/dist/iconify.js"
import { DarkThemeToggle } from "flowbite-react"
import StoreContext from "../context/store"
import { useContext } from "react"

export default () => {
    const { User } = useContext(StoreContext)
    return <header className="flex">
        <form className="flex items-center max-w-sm mx-auto">
            <label htmlFor="simple-search" className="sr-only">Search</label>
            <div className="relative w-full">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48" className="text-gray-600 dark:text-gray-100"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={4}><path strokeLinejoin="round" d="M6 40h6V8H6"></path><path d="M24 34V14"></path><path strokeLinejoin="round" d="M42 40h-6V8h6"></path></g></svg>
                </div>
                <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search item...." required />
            </div>
            <button type="submit" className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
                <span className="sr-only">Search</span>
            </button>
        </form>
        <div className="flex justify-center items-center">
            <div className="mx-1">
                <DarkThemeToggle />
            </div>
            <div className="mx-1">
                <Icon icon="eos-icons:rotating-gear" className="text-2xl text-gray-500 dark:text-gray-400" />
            </div>
            <div className="mx-2">
                <Icon icon="ph:bell" className="text-2xl text-gray-500 dark:text-gray-400" />
            </div>
            <div className="">
                <a href="/logout">
                    {
                        User.avatar ?
                            <img src={User.avatar} alt="" className='profile-pic-s m-1 border-2 rounded-full border-gray-600' />
                            :
                            <Icon icon="ph:user-light" className="p-1 text-4xl mx-1 border-2 rounded-full border-gray-600 text-gray-900 dark:text-gray-100" />
                    }
                </a>
            </div>
        </div>
    </header>
}
import { Cookies } from "../utilities/globals"


export default () => {
    const handleLogout = () => {
        Cookies.delete('user')
        window.location.href = '/'
    }
    return (
        <div className="w-full h-1/2 flex justify-center items-center items-center">
            <form className="max-w-sm mx-auto w-full">
                <h1 className="text-2xl text-black dark:text-white">Did you want to logout!</h1>
                <button type="button" onClick={handleLogout} className="mt-3  text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" style={{ width: 240 }}>Logout</button>
            </form>
        </div>
    )
}
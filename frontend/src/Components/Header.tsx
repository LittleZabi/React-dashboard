import { Icon } from "@iconify/react/dist/iconify.js"
import { DarkThemeToggle } from "flowbite-react"
import StoreContext from "../context/store"
import { useContext } from "react"

export default () => {
    const { User } = useContext(StoreContext)
    return <header className="flex">
        <div className="search-bar flex mx-1">
            <input type="search" className="" placeholder="search..." />
            <button>
                <Icon icon="bitcoin-icons:search-outline" />
            </button>
        </div>
        <div className="flex justify-center items-center">
            <div className="mx-1">
                <DarkThemeToggle />
            </div>
            <div className="mx-1">
                <Icon icon="eos-icons:rotating-gear" className="text-2xl" />
            </div>
            <div className="mx-2">
                <Icon icon="ph:bell" className="text-2xl" />
            </div>
            <div className="">
                {
                    User.avatar ?
                        <img src={User.avatar} alt="" className='profile-pic-s m-1 border-2 rounded-full border-gray-600' />
                        :
                        <Icon icon="ph:user-light" className="p-1 text-4xl mx-1 border-2 rounded-full border-gray-600" />
                }
            </div>
        </div>
    </header>
}
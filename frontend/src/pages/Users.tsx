import { Icon } from "@iconify/react/dist/iconify.js"
import { useContext } from "react"
import StoreContext from "../context/store"
import NewUserModal from "../Modals/new-user-modal"

export default () => {
    const { modal, setModal } = useContext(StoreContext)
    return <div className="mt-6 user-view">
        <button onClick={() => setModal({ enabled: !modal.enabled })} className="bg-gray-700 focus:ring-4 dark:focus:ring-blue-900 focus:ring-blue-300 hover:bg-gray-900 text-white py-2 px-6 rounded inline-flex items-center">
            <span className="mx-1">
                <Icon icon="ic:twotone-plus" /></span>
            <span>New User</span>
        </button>
        {modal.enabled && <NewUserModal title={"Add new user"} />}
    </div>
}
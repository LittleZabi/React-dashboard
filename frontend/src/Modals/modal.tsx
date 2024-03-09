import { useContext, useEffect, useState } from "react"
import StoreContext from "../context/store"

export default ({ children, title }: any) => {
    const { modal, setModal } = useContext(StoreContext)
    const [fadeOut, setFadeOut] = useState(false)
    useEffect(() => {
        document.body.style.overflow = 'hidden'
    }, [])
    const closeModal = () => {
        setFadeOut(true)
        setTimeout(() => {
            setModal(false)
        }, 400);
    }
    return <div className={`flex modal ${fadeOut ? 'fade-out' : 'fade-in'}`}>
        <div className="flex overflow-y-auto modal-view-x overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="inner-modal relative p-4 w-full max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {title ? title : ''}
                        </h3>
                        <button onClick={closeModal} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    </div>
}
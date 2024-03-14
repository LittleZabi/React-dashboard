import Modal from "./modal"

export default ({ options }: any) => {
    return (
        <Modal title={options.modal_title}>
            <div className="relative pb-2 pt-2 w-full max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="pb-1 text-center">
                        <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <h3 className="mb-5 text-lg px-2 font-normal text-gray-500 dark:text-gray-400">
                            {options.title}
                        </h3>
                        {options.buttons && options.buttons.map((button: any, i: number) => {
                            if (button.type === 'close')
                                return (
                                    <button onClick={button.cb} key={i} type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">{button.title}</button>
                                )
                            else
                                return (
                                    <button onClick={button.cb} key={i} type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                        {button.title}
                                    </button>
                                )
                        })}
                    </div>
                </div>
            </div>
        </Modal>
    )
}
import { Icon } from "@iconify/react/dist/iconify.js"
import Modal from "./modal"
import axios from 'axios';
import { useContext, useEffect, useState } from "react";
import StoreContext from "../context/store";
import { BACKEND_API } from "../utilities/variables";
import { Dropdown, Spinner } from "flowbite-react";
import { life } from "../utilities/globals";

export default ({ title }: any) => {
    const { setAlert, modal, setModal, User } = useContext(StoreContext)
    const [editMode, setEditMode]: any = useState(false);
    const [searchRes, setSearchRes]: any = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        user_id: User.id,
        name: '',
        description: '',
        price: 0,
        parent_id: 0,
        quantity: 0,
    });
    useEffect(() => {

        if (modal.material) {
            if (modal.material.parent) {
                modal.material.parent.selected = true
                setSearchRes([modal.material.parent])
            }
            setEditMode(true)
            setFormData(modal.material)
        }
    }, [])

    let searchBounce: any = undefined
    const handleSearch = async (e: any) => {
        let term = e.target.value;
        setIsLoading(true)
        if (searchBounce) {
            clearTimeout(searchBounce)
        }
        searchBounce = setTimeout(async () => {
            await axios.get(BACKEND_API + '/api/search/materials', { params: { query: term } })
                .then(response => {
                    setSearchRes(response.data);
                })
                .catch(error => console.error(error))
                .finally(() => setIsLoading(false));
        }, 500);

    }
    const validateFormData = (formData: HTMLFormElement) => {
        if (formData.name === '') {
            return "Please enter material name."
        }
        return null;
    };

    const submitFormData = async (formData: any) => {
        const validationError = validateFormData(formData);
        if (validationError) {
            setAlert({ message: validationError, variant: 'danger' })
            return Promise.reject(validationError);
        }
        try {
            let o: any = {}
            if (editMode) o.id = formData.id
            const response = await axios.post(BACKEND_API + '/api/materials/new', { ...formData, ...o });
            return response.data;
        } catch (error: any) {
            setAlert({ message: error?.response?.status === 400 ? error?.response.data.message : error.message, variant: 'danger' })
            return Promise.reject('An error occurred while submitting the form.');
        }
    }
    const handleMaterial = (item: any) => {
        item.selected = true
        setSearchRes([item])
        setFormData({ ...formData, parent_id: item.id })
    }
    const handleSubmit = async (e: any) => {
        setAlert({ message: false })
        e.preventDefault();
        try {
            const response = await submitFormData(formData);
            setAlert({ message: response.message, variant: 'success' })
            setModal({ newUser: false })
            setFormData({
                user_id: User.id,
                name: '',
                description: '',
                price: 0,
                parent_id: 0,
                quantity: 0
            });
            window.location.reload()
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return <Modal title={editMode ? 'Edit Material ' + formData.name : title}>
        <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Parent Material (optional)</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                </div>
                <input onChange={handleSearch} type="text" id="table-search" className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for material" />
            </div>
            <div className="relative">
                {searchRes.length && !isLoading ? <div className="flex items-center bg-gray-200 dark:bg-gray-900 px-3 py-3 text-gray-900 whitespace-nowrap dark:text-white">
                    <ul style={{ width: '100%' }} className="yex">
                        {
                            searchRes.map((item: any, i: number) => {
                                return (
                                    <li key={i} className="mb-2 p-1 hover:bg-gray-300 dark:hover:bg-gray-800 rounded" style={{ cursor: 'pointer' }} onClick={() => handleMaterial(item)}>
                                        <div className="ps-3">
                                            <div className="text-base font-semibold">
                                                <span style={{ textTransform: 'capitalize' }}>{item.name}</span>
                                                {
                                                    item.quantity &&
                                                    <span style={{ fontSize: 12 }} className="ml-2 font-normal text-gray-500">Quantity: {item.quantity}</span>
                                                }
                                            </div>
                                            <div style={{ fontSize: 12 }} className="font-normal text-gray-500">
                                                {item.createdAt && life(item.createdAt).format('D MM YYYY')} {item.createdAt && `(${life(item.createdAt).from()})`}
                                                {item.selected && <span style={{ color: '#23c823', fontStyle: 'italic' }} className="ml-2">✔ Selected</span>}
                                            </div>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                    : ''}
                {isLoading &&
                    <div className="flex items-center bg-gray-200 dark:bg-gray-900 px-3 py-3 text-gray-900 whitespace-nowrap dark:text-white">
                        <Spinner />
                    </div>
                }
            </div>
            <div className="mt-5 relative z-0 w-full mb-5 group">
                <input type="text" value={formData.name} onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} name="name" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Enter Material name</label>
            </div>
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Material Description</label>
            <textarea value={formData.description} onChange={(e: any) => setFormData({ ...formData, description: e.target.value })} id="message" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Leave a comment..."></textarea>
            <div className="my-3">
                <label htmlFor="number-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter material price:</label>
                <input value={formData.price} onChange={(e: any) => setFormData({ ...formData, price: e.target.value })} type="number" id="number-input" className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min={0} placeholder="$399" required />
            </div>
            <label htmlFor="quantity-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Choose quantity:</label>
            <div className="relative flex items-center max-w-[8rem]">
                <button onClick={() => setFormData({ ...formData, quantity: formData.quantity > 0 ? formData.quantity - 1 : formData.quantity })} type="button" id="decrement-button" data-input-counter-decrement="quantity-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                    <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                    </svg>
                </button>
                <input type="text" value={formData.quantity} onChange={(e: any) => setFormData({ ...formData, quantity: parseInt(e.target.value) })} id="quantity-input" data-input-counter aria-describedby="helper-text-explanation" className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="12" required />
                <button onClick={() => setFormData({ ...formData, quantity: formData.quantity + 1 })} type="button" id="increment-button" data-input-counter-increment="quantity-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                    <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                    </svg>
                </button>
            </div>
            <p id="helper-text-explanation" className="mt-2 mb-2 text-sm text-gray-500 dark:text-gray-400">Please select quantity of the material.</p>
            <button type="submit" className="mb-5 text-white inline-flex items-center bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-10 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 text-lg">
                {editMode ?
                    <>
                        <Icon icon="material-symbols-light:save-outline" className="mr-1 text-lg" />
                        Save
                    </> :
                    <>
                        <Icon icon="ic:twotone-plus" className="mr-1 text-lg" />
                        Add Material
                    </>
                }
            </button>
        </form>

    </Modal >
}
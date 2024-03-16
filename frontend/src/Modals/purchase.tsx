import { Icon } from "@iconify/react/dist/iconify.js"
import { Dropdown } from 'flowbite-react';
import Modal from "./modal"
import axios from 'axios';
import { useContext, useEffect, useState } from "react";
import StoreContext from "../context/store";
import { BACKEND_API } from "../utilities/variables";

export default ({ title, materials }: any) => {
    const { setAlert, modal, setModal, User } = useContext(StoreContext)
    const [editMode, setEditMode]: any = useState(false);
    const [selectedMat, setSelectedMat]: any = useState(false)
    const [formData, setFormData] = useState({
        userId: User.id,
        purchasePrice: 0,
        quantity: 1,
        MaterialId: null
    });
    useEffect(() => {
        if (modal.purchase) {
            console.log(modal.purchase)
            setSelectedMat(modal.purchase.Material)
            setEditMode(true)
            setFormData(modal.purchase)
        }
    }, [])

    const validateFormData = (formData: HTMLFormElement) => {
        if (!selectedMat)
            return 'Please select material!'
        if (!editMode && !formData.userId)
            return "User is not logged! please login again."
        if (formData.purchasePrice === 0)
            return "Please enter selling price"
        if (formData.name === '')
            return "Please enter material name."
        return null;
    };

    const submitFormData = async (formData: any) => {
        const validationError = validateFormData(formData);
        if (validationError) {
            setAlert({ message: validationError, variant: 'danger' })
            return Promise.reject(validationError);
        }
        try {
            let o: any = { editMode, MaterialId: selectedMat.id ? selectedMat.id : formData.MaterialId }
            setFormData({ ...formData, ...o })
            if (editMode) o.id = formData.id
            const response = await axios.post(BACKEND_API + '/api/purchases/new', { ...formData, ...o });
            return response.data;
        } catch (error: any) {
            setAlert({ message: error?.response?.status === 400 ? error?.response.data.message : error.message, variant: 'danger' })
            return Promise.reject('An error occurred while submitting the form.');
        }
    }
    const handleSubmit = async (e: any) => {
        setAlert({ message: false })
        e.preventDefault();
        try {
            const response = await submitFormData(formData);
            setAlert({ message: response.message, variant: 'success' })
            setModal({ newUser: false })
            setFormData({
                userId: User.id,
                purchasePrice: 0,
                quantity: 1,
                MaterialId: null
            });
            window.location.reload()
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
    const DropDown = ({ materials, parent }: any) => {
        return (
            <Dropdown label='' placement="right" renderTrigger={() => <span className="iuk">{parent.name} <Icon icon="ic:round-chevron-right" className="supx" /></span>} size='sm'>
                {materials.map((mat: any, i: number) => {
                    if (mat.children && mat.children.length)
                        return <DropDown key={i} materials={mat.children} parent={mat} />
                    else
                        return <Dropdown.Item onClick={() => setSelectedMat(mat)} key={i} >{mat.name}</Dropdown.Item>
                })}
            </Dropdown>
        )
    }
    return <Modal title={editMode ? 'Edit purchase record' : title}>
        <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
            <div className="mt-2 mb-3 dark:text-white ">
                <Dropdown label={selectedMat ? selectedMat.name : 'Materials'} dismissOnClick={false} style={{ background: 'rgba(28, 100, 242, 1)', width: 170 }} inline >
                    {
                        materials.map((material: any, i: number) => {
                            if (material.children && material.children.length)
                                return <DropDown key={i} materials={material.children} parent={material} />
                            else
                                return <Dropdown.Item onClick={() => setSelectedMat(material)} key={i}>{material.name}</Dropdown.Item>
                        })
                    }
                </Dropdown>
            </div>
            <label htmlFor="quantity-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Choose quantity:</label>
            <div className="relative flex items-center max-w-[8rem]">
                <button onClick={() => setFormData({ ...formData, quantity: formData.quantity > 0 ? formData.quantity - 1 : formData.quantity })} type="button" id="decrement-button" data-input-counter-decrement="quantity-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                    <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                    </svg>
                </button>
                <input type="text" value={Number(formData.quantity)} onChange={(e: any) => setFormData({ ...formData, quantity: parseInt(e.target.value) })} id="quantity-input" data-input-counter aria-describedby="helper-text-explanation" className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="12" required />
                <button onClick={() => setFormData({ ...formData, quantity: formData.quantity + 1 })} type="button" id="increment-button" data-input-counter-increment="quantity-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                    <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                    </svg>
                </button>
            </div>
            <p id="helper-text-explanation" className="mt-2 mb-2 text-sm text-gray-500 dark:text-gray-400">Please select quantity of the material which you purchased.</p>
            <label htmlFor="quantity-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Selling Price:</label>
            <div className="relative flex items-center max-w-[8rem]">
                <button onClick={() => setFormData({ ...formData, purchasePrice: formData.purchasePrice > 0 ? formData.purchasePrice - 1 : formData.purchasePrice })} type="button" id="decrement-button" data-input-counter-decrement="quantity-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                    <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                    </svg>
                </button>
                <input type="text" value={Number(formData.purchasePrice)} onChange={(e: any) => setFormData({ ...formData, purchasePrice: parseInt(e.target.value) })} id="quantity-input" data-input-counter aria-describedby="helper-text-explanation" className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="12" required />
                <button onClick={() => setFormData({ ...formData, purchasePrice: Number(formData.purchasePrice) + 1 })} type="button" id="increment-button" data-input-counter-increment="quantity-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                    <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                    </svg>
                </button>
            </div>
            <p id="helper-text-explanation" className="mt-2 mb-2 text-sm text-gray-500 dark:text-gray-400">Enter the price of purchase in total.</p>
            <button type="submit" className="mb-5 mt-5 text-white inline-flex items-center bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-10 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 text-lg">
                {editMode ?
                    <>
                        <Icon icon="material-symbols-light:save-outline" className="mr-1 text-lg" />
                        Save
                    </> :
                    <>
                        <Icon icon="ic:twotone-plus" className="mr-1 text-lg" />
                        Add purchase
                    </>
                }
            </button>
        </form >

    </Modal >
}
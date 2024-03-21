import { Icon } from "@iconify/react/dist/iconify.js"
import Modal from "./modal"
import axios from 'axios';
import { useContext, useEffect, useState } from "react";
import StoreContext from "../context/store";
import { BACKEND_API } from "../utilities/variables";

export default ({ title }: any) => {
    const { setAlert, modal, setModal } = useContext(StoreContext)
    const [editMode, setEditMode]: any = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        fullname: '',
        email: '',
        avatar: null,
        address: '',
        password: '',
        old_avatar: '',
        asAdmin: false
    });
    useEffect(() => {
        if (modal.userObject) {
            setEditMode(modal.userObject)
            let old_avatar = modal.userObject.avatar
            modal.userObject.avatar = null
            setFormData({ ...modal.userObject, old_avatar })
        }
    }, [])

    const validateFormData = (formData: HTMLFormElement) => {
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.username || !usernameRegex.test(formData.username)) {
            return 'Username is invalid. Only letters, numbers, and underscore (_) are allowed.';
        }
        if (!formData.email || !emailRegex.test(formData.email)) {
            return 'Email address is invalid.';
        }
        if (editMode === false && !formData.password) {
            return "Please enter a strong password."
        }
        if (formData.avatar) {
            const allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedFormats.includes(formData.avatar.type)) {
                return 'Invalid image format. Please upload an image in JPEG, PNG, or GIF format.';
            }
            if (formData.avatar.size > 2 * 1024 * 1024) {
                return 'Image size exceeds 2MB limit.';
            }
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
            let oldData = {}
            if (editMode) {
                oldData = { id: modal.userObject.id, update: editMode, old_username: modal.userObject.username, old_email: modal.userObject.email }
            }
            const response = await axios.post(BACKEND_API + '/api/new-user', { ...formData, ...oldData }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
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
                username: '',
                fullname: '',
                email: '',
                avatar: null,
                address: '',
                password: '',
                old_avatar: '',
                asAdmin: false
            });
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return <Modal title={editMode ? 'Edit User @' + formData.username : title}>
        <form encType="multipart/form-data" className="p-4 md:p-5" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Username</label>
                <div className="flex mb-2">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                        </svg>
                    </span>
                    <input type="text" id="username" className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="E.g. little_zabi" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                </div>
                <div className="mb-2">
                    <label htmlFor="fullname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter fullname</label>
                    <input type="text" id="fullname" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Doe" value={formData.fullname} onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} />
                </div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Email address</label>
                <div className="relative mb-2">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                            <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                            <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                        </svg>
                    </div>
                    <input type="text" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="E.g. littlezabi123@xyz.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="mb-2">
                    <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Address</label>
                    <input type="text" id="address" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="E.g. 9th Home, 2nd street of kings town, ABC" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>
                <div>
                    {formData.old_avatar !== '' &&
                        <a style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.6)' }} href={formData.old_avatar} target="_blank">{formData.old_avatar}</a>
                    }
                    <label id='avatar' className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="default_size">Choose avatar</label>
                    <input className="block w-full mb-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="avatar" type="file" onChange={(e: any) => setFormData({ ...formData, avatar: e.target.files[0] })} />
                </div>
                <div className="mb-2">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{editMode ? "New" : "Enter"} Password</label>
                    <input type="password" id="password" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter a strong password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
                <div className="mt-4 mb-4 flex">
                    <div className="flex items-center h-5">
                        <input id="asAdmin" aria-describedby="helper-checkbox-text" type="checkbox" checked={formData.asAdmin} onChange={(e: any) => setFormData({ ...formData, asAdmin: e.target.checked })} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div className="ms-2 text-sm">
                        <label htmlFor="asAdmin" className="font-medium text-gray-900 dark:text-gray-300">User as admin</label>
                        <p id="helper-checkbox-text" className="text-xs font-normal text-gray-500 dark:text-gray-300">Check if you want this user act as super admin.</p>
                    </div>
                </div>
            </div>
            <button type="submit" className="text-white inline-flex items-center bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-10 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 text-lg">
                {editMode ?
                    <>
                        <Icon icon="material-symbols-light:save-outline" className="mr-1 text-lg" />
                        Save
                    </> :
                    <>
                        <Icon icon="ic:twotone-plus" className="mr-1 text-lg" />
                        Add user
                    </>
                }
            </button>
        </form>

    </Modal>
}
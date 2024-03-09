import { Icon } from "@iconify/react/dist/iconify.js"
import Modal from "./modal"
import axios from 'axios';
import { useContext, useState } from "react";
import StoreContext from "../context/store";

const validateFormData = (formData: HTMLFormElement) => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.username || !usernameRegex.test(formData.username)) {
        return 'Username is invalid. Only letters, numbers, and underscore (_) are allowed.';
    }
    if (!formData.email || !emailRegex.test(formData.email)) {
        return 'Email address is invalid.';
    }
    if (formData.avatar) {
        const allowedFormats = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedFormats.includes(formData.avatar.type)) {
            return 'Invalid image format. Please upload an image in JPEG, PNG, or GIF format.';
        }
        if (formData.avatar.size > 2 * 1024 * 1024) {
            return 'Image size exceeds 2MB limit.';
        }
    }
    return null;
};


export default ({ title }: any) => {
    const { setAlert } = useContext(StoreContext)
    const [formData, setFormData] = useState({
        username: '',
        fullname: '',
        email: '',
        avatar: null,
        address: '',
        password: ''
    });

    const submitFormData = async (formData: any) => {
        const validationError = validateFormData(formData);
        if (validationError) {
            setAlert({ message: validationError, variant: 'danger' })
            return Promise.reject(validationError);
        }
        try {
            const response = await axios.post('/api/', formData);
            return response.data;
        } catch (error) {
            setAlert({ message: validationError, variant: 'danger' })
            return Promise.reject('An error occurred while submitting the form.');
        }
    }
    // const submit = () => {
    //     submitFormData(formData)
    //         .then((response) => {
    //             console.log('Form submitted successfully:', response);
    //         })
    //         .catch((error) => {
    //             console.error('Error submitting form:', error);
    //         });
    // }
    // const handleChange = (e) => {
    //     const { name, value, files } = e.target;
    //     setFormData({
    //         ...formData,
    //         [name]: files ? files[0] : value // If input type is file, use files[0], otherwise use value
    //     });
    // };
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await submitFormData(formData);
            console.log('=> ', response)

            // const response = await axios.post('backend_url_here', formData);
            // console.log('Form submitted successfully:', response.data);
            setFormData({
                username: '',
                fullname: '',
                email: '',
                avatar: null,
                address: '',
                password: ''
            });
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return <Modal title={title}>
        <form className="p-4 md:p-5" onSubmit={handleSubmit}>
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
                    <input type="text" id="fullname" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="E.g. 9th Home, 2nd street of kings town, ABC" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>
                <div>
                    <label id='avatar' className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="default_size">Choose avatar</label>
                    <input className="block w-full mb-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="avatar" type="file" onChange={(e: any) => setFormData({ ...formData, avatar: e.target.files[0] })} />
                </div>
            </div>
            <button type="submit" className="text-white inline-flex items-center bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-10 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 text-lg">
                <Icon icon="ic:twotone-plus" className="mr-1 text-lg" />
                Add user
            </button>
        </form>

    </Modal>
}
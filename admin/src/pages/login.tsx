import { useContext, useEffect, useState } from "react";
import StoreContext from "../context/store";
import axios from "axios";
import { BACKEND_API } from "../utilities/variables";
import { Cookies } from "../utilities/globals";

export default ({ setUser_ }: any) => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setAlert, setUser } = useContext(StoreContext); // State for alert message
    useEffect(() => {
        let u = Cookies.get('user')
        if (u) {
            setUser(u)
            setUser_(u)
        }
    })
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!usernameOrEmail || !password) {
            setAlert({ message: 'Please provide both username/email and password', variant: 'danger' });
            return;
        }
        try {
            const response = await axios.post(BACKEND_API + '/api/login', {
                usernameOrEmail,
                password,
            });
            Cookies.set('user', JSON.stringify(response.data.user), { expires: 365 })
            setAlert({ message: response.data.message })
            setUser_(response.data.user)
            setUser(response.data.user)
        } catch (error) {
            console.error(error);
            setAlert({ message: 'Login failed. Please check your credentials or try again.', variant: 'danger' });
        }
    };
    return (
        <div className="w-full flex justify-center items-center">
            <form className="max-w-sm mx-auto w-full" onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">email address or username</label>
                    <input type="text" id="email" onChange={(e: any) => setUsernameOrEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="emailaddress@xyz.com" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                    <input type="password" onChange={(e: any) => setPassword(e.target.value)} id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-black dark:text-white" required />
                </div>
                <div className="flex items-start mb-5">
                    <div className="flex items-center h-5">
                        <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" />
                    </div>
                    <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </form>
        </div>
    )
}
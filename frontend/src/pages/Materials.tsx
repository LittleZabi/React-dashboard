import { Icon } from "@iconify/react/dist/iconify.js"
import { useContext, useEffect, useState } from "react"
import StoreContext from "../context/store"
import axios from "axios"
import { BACKEND_API } from "../utilities/variables"
import { getRandomColor, life, setUserCharName } from "../utilities/globals"
import LoadingSkeleton from "../Components/LoadingSkeleton"
import ConfirmationModel from "../Modals/confirmationModel"
import Materials from "../Modals/materials"

export default () => {
    const { modal, setModal, setAlert, User } = useContext(StoreContext)
    const [allMaterials, setAllMaterials] = useState([]);
    const [loading, setLoading] = useState(true)
    const [material, setMaterial]: any = useState({})
    const getData = async () => {
        await axios.get(BACKEND_API + `/api/materials/all/${User.id}/${User.asAdmin}`).then((res) => {
            setAllMaterials(res.data);
            setLoading(false)
        })
            .catch((error) => {
                console.error(error);
            });
    }
    useEffect(() => {
        getData()
    }, []);
    const editHandler = (item: any) => {
        setModal({ newMaterial: true, material: item })
    }
    const remUser = (item: any) => {
        setMaterial(item)
        setModal({ confirmation: true, item })
    }
    const deleteMat = async () => {
        setAlert({ message: false })
        setLoading(true)
        setModal({ confirmation: false })
        await axios.delete(BACKEND_API + `/api/materials/${material.id}/delete`).then(res => {
            setAlert({ message: res.data.message, variant: 'success' })
            setLoading(false)
            getData()
        })
            .catch(error => {
                setAlert({ message: error.message, variant: 'danger' })
                setLoading(false)
                console.error(error)
            })
    }
    return <div className="mt-6 user-view">
        <h1 className="text-2xl my-3 font-bold">List of Materials</h1>
        <button onClick={() => setModal({ newMaterial: true })} className="bg-gray-700 focus:ring-4 dark:focus:ring-blue-900 focus:ring-blue-300 hover:bg-gray-900 text-white py-2 px-6 rounded inline-flex items-center">
            <span className="mx-1">
                <Icon icon="ic:twotone-plus" /></span>
            <span>New Material</span>
        </button>
        {modal.newMaterial && <Materials title={"Add new Material"} />}
        {modal.confirmation &&
            <ConfirmationModel options={{
                type: 'confirm',
                modal_title: "Confirm to delete",
                title: `Are you sure you want to delete this (${material.name}) Material? All selling and purchased records will be removed!`,
                buttons: [
                    { title: "Yes, I'm sure", cb: deleteMat },
                    { title: "No, cancel", cb: () => setModal({ enabled: false }), type: 'close' }]
            }} />
        }
        <div className="mt-4 overflow-x-auto shadow-md sm:rounded-lg">
            <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
                <div>
                    <button id="dropdownRadioButton" data-dropdown-toggle="dropdownRadio" className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button">
                        <svg className="w-3 h-3 text-gray-500 dark:text-gray-400 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                        </svg>
                        Last 30 days
                        <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                        </svg>
                    </button>
                    <div id="dropdownRadio" className="z-10 hidden w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" data-popper-reference-hidden="" data-popper-escaped="" data-popper-placement="top" style={{ position: 'absolute', inset: 'auto auto 0px 0px', margin: 0, transform: 'translate3d(522.5px, 3847.5px, 0px)' }}>
                        <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownRadioButton">
                            <li>
                                <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                    <input id="filter" type="radio" value="" name="filter-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label htmlFor="filter" className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Last day</label>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                    <input onChange={() => { }} checked={false} id="filter1" type="radio" value="" name="filter-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label htmlFor="filter1" className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Last 7 days</label>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <label htmlFor="table-search" className="sr-only">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                    </div>
                    <input type="text" id="table-search" className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for items" />
                </div>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            #
                        </th>
                        <th scope="col" className="px-6 py-3">
                            name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Description
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Price
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Parent
                        </th>
                        <th scope="col" className="px-6 py-3">
                            User
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Created At
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {loading === false && allMaterials.map((item: any, i: number) => {
                        return (
                            <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">

                                <td className="px-6 py-4">
                                    {++i}
                                </td>
                                <td className="px-6 py-4">
                                    {item.name}
                                </td>
                                <td className="px-6 py-4">
                                    {item.description}
                                </td>
                                <td className="px-6 py-4">
                                    ${item.price}
                                </td>
                                <td className="px-6 py-4">
                                    {item.parent ? item.parent.name : 'Parent'}
                                </td>
                                <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                    {item.avatar != '' ?
                                        <img className="w-8 h-8 rounded-full" src={item.User.avatar} alt="Neil image" />
                                        :
                                        <span className="user-txt-name" style={{
                                            backgroundColor: getRandomColor(.7)
                                        }}>
                                            {setUserCharName(item.User.fullname)}
                                        </span>
                                    }
                                    <div className="ps-3">
                                        <div className="text-base font-semibold">
                                            {item.User.fullname}
                                            <span className="ml-2 font-normal text-gray-500">@{item.User.username}</span>
                                        </div>
                                        <div className="font-normal text-gray-500">{item.User.email}</div>
                                    </div>
                                </th>
                                <td className="px-6 py-4">
                                    {life(item.createdAt).from()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center px-6 py-4">
                                        <button onClick={() => editHandler(item)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                        <button onClick={() => remUser(item)} className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3">Remove</button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {loading && <LoadingSkeleton />}
        </div>

    </div>
}
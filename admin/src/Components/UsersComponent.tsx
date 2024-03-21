import { useEffect, useState } from "react"
import axios from "axios"
import { BACKEND_API } from "../utilities/variables"
import { getRandomColor, setUserCharName } from "../utilities/globals"

export default () => {
    const [topUsersBySellings, setTopUsersBySellings] = useState([]);
    const [topUsersByPurchases, setTopUsersByPurchases] = useState([]);
    useEffect(() => {
        // Fetch different user types concurrently
        Promise.all([
            axios.get(BACKEND_API + '/api/users/topBySellings'),
            axios.get(BACKEND_API + '/api/users/topByPurchases'),
            // axios.get(BACKEND_API + '/api/users/new'),
            // axios.get(BACKEND_API + '/api/users/all'),
        ])
            .then(([response1, response2]) => {
                setTopUsersBySellings(response1.data);
                setTopUsersByPurchases(response2.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);
    return <div className="mt-6 user-view">
        <div className="mt-3 p-1 flex kccc">
            <div className="w-full m-1 max-w-md bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Top Sellings Users</h5>
                    <a href="#" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                        View all
                    </a>
                </div>
                <div className="flow-root">
                    <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                        {topUsersBySellings.map((user: any) => {
                            return <li key={user.id} className="py-3 sm:py-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        {user.avatar && user.avatar != '' ?
                                            <img className="w-8 h-8 rounded-full object-fit" src={user.avatar} alt="Neil image" />
                                            :
                                            <span className="user-txt-name" style={{
                                                backgroundColor: getRandomColor(.7)
                                            }}>
                                                {setUserCharName(user.fullname)}
                                            </span>
                                        }

                                    </div>
                                    <div className="flex-1 min-w-0 ms-4">
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                            {user.fullname}
                                            <span className="text-gray-500 ml-2">
                                                @{user.username}
                                            </span>
                                        </p>

                                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                            {user.email}
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                        ${user.sellings}
                                    </div>
                                </div>
                            </li>
                        })}
                    </ul>
                </div>
            </div>
            <div className="w-full m-1 max-w-md bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Users top purchase </h5>
                    <a href="#" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                        View all
                    </a>
                </div>
                <div className="flow-root">
                    <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                        {topUsersByPurchases.map((user: any) => {
                            return <li key={user.id} className="py-3 sm:py-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        {user.avatar != '' ?
                                            <img className="w-8 h-8 rounded-full object-fit" src={user.avatar} alt="Neil image" />
                                            :
                                            <span className="user-txt-name" style={{
                                                backgroundColor: getRandomColor(.7)
                                            }}>
                                                {setUserCharName(user.fullname)}
                                            </span>
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0 ms-4">
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                            {user.fullname}
                                            <span className="text-gray-500 ml-2">
                                                @{user.username}
                                            </span>
                                        </p>

                                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                            {user.email}
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                        ${user.purchases}
                                    </div>
                                </div>
                            </li>
                        })}
                    </ul>
                </div>
            </div>
        </div>
    </div>
}
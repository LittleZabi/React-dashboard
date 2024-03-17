import { useEffect, useState } from 'react';
import UsersComponent from '../Components/UsersComponent';
import ChartPurchase from '../charts/purchaseChart';
import ChartSells from '../charts/sellsChart';
import ChartUser from '../charts/usersChart';
import ChartVisitors from '../charts/visitorsChart';
import axios from 'axios';
import { BACKEND_API } from '../utilities/variables';
import { Card } from 'flowbite-react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { numberFormat } from '../utilities/globals';
import { numberFormat as numberFormatChart } from 'highcharts';
import TopSellsMatChart from '../charts/topSellsMatChart';

export default () => {
    const [data, setData] = useState({
        visitors: [], users: [], sells: [], purchases: [],
        matSells: [],
        matPurchased: []
    })
    const [visitorsData, setVisitorsData] = useState([[], []]);
    const [percent, setPercent] = useState({ visitors: 0, sells: 0, purchase: 0, users: 0 })
    const [sellsData, setSellsData] = useState([[], []])
    const [purchaseData, setPurchaseData] = useState([[], []])
    const [usersData, setUsersData] = useState([[], []])
    const [totalSells, setTotalSells] = useState(0)
    const [totalPurchase, setTotalPurchase] = useState(0)
    const [totalVisitors, setTotalVisitors] = useState(0)
    const today = new Date();
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 1); // Set to first day of two months ago
    useEffect(() => {
        Promise.all([
            axios.get(BACKEND_API + '/count/visitors'),
            axios.get(BACKEND_API + '/count/sells'),
            axios.get(BACKEND_API + '/count/user'),
            axios.get(BACKEND_API + '/count/purchases'),
            axios.get(BACKEND_API + '/count/materials/top-materials')
        ])
            .then(([visitors, sells, users, purchases, materialTop]: any) => {
                setData({
                    visitors: visitors.data,
                    users: users.data,
                    sells: sells.data,
                    purchases: purchases.data,
                    matSells: materialTop.data.sells,
                    matPurchased: materialTop.data.purchased
                })
                console.log(materialTop.data)
                // purchase
                let p: any = {}
                purchases.data.forEach((item: any) => {
                    const c = new Date(item.createdAt);
                    if (c >= twoMonthsAgo && c <= today) {
                        if (p[new Date(item.createdAt).getMonth()]) p[new Date(item.createdAt).getMonth()].push(item)
                        else p[new Date(item.createdAt).getMonth()] = [item]
                    }
                });
                setPurchaseData(Object.values(p));
                // sells
                let s: any = {}
                sells.data.forEach((item: any) => {
                    const c = new Date(item.createdAt);
                    if (c >= twoMonthsAgo && c <= today) {
                        if (s[new Date(item.createdAt).getMonth()]) s[new Date(item.createdAt).getMonth()].push(item)
                        else s[new Date(item.createdAt).getMonth()] = [item]
                    }
                });
                setSellsData(Object.values(s));
                // usrs
                let u: any = {}
                users.data.forEach((users: any) => {
                    const visitorDate = new Date(users.createdAt);
                    if (visitorDate >= twoMonthsAgo && visitorDate <= today) {
                        if (u[new Date(users.createdAt).getMonth()]) u[new Date(users.createdAt).getMonth()].push(users)
                        else u[new Date(users.createdAt).getMonth()] = [users]
                    }
                });
                setUsersData(Object.values(u));
                // visitors
                let v: any = {}
                visitors.data.forEach((visitor: any) => {
                    const visitorDate = new Date(visitor.createdAt);
                    if (visitorDate >= twoMonthsAgo && visitorDate <= today) {
                        if (v[new Date(visitor.createdAt).getMonth()]) v[new Date(visitor.createdAt).getMonth()].push(visitor)
                        else v[new Date(visitor.createdAt).getMonth()] = [visitor]
                    }
                });
                setVisitorsData(Object.values(v));
            })

    }, [])

    useEffect(() => {
        let s = 0
        let v = 0
        let p = 0
        let u = 0
        // sells percent
        if (sellsData[0].length !== 0 && purchaseData[1]) s = (sellsData[1].length - sellsData[0].length) / sellsData[0].length * 100
        // visitors percentage
        if (visitorsData[0].length !== 0 && visitorsData[1]) v = (visitorsData[1].length - visitorsData[0].length) / visitorsData[0].length * 100
        // purchase percent
        if (purchaseData[0].length !== 0 && purchaseData[1]) p = (purchaseData[1].length - purchaseData[0].length) / purchaseData[0].length * 100
        // users
        if (usersData[0].length !== 0 && usersData[1]) u = (usersData[1].length - usersData[0].length) / usersData[0].length * 100

        setPercent({ visitors: v, sells: s, purchase: p, users: u })
        let t = 0
        data.sells.forEach((e: any) => {
            t += Number(e.sellingPrice)
        })
        setTotalSells(t)
        let pt: number = 0
        data.purchases.forEach((e: any) => {
            pt += Number(e.purchasePrice)
        })
        setTotalPurchase(pt)
        let vt = 0
        data.visitors.map((v: any) => {
            vt += v.totalVisits
        })
        setTotalVisitors(vt)
    }, [visitorsData])
    return (
        <div className="d-wrap">
            <h1 className='p-title'>
                Dashboard
            </h1>
            <div className='full-chart flex'>
                <Card className="card-kckx my-2 mx-2 px-4 shadow-sm relative">
                    <h4 className='font-bold text-xs text-gray-700 dark:text-gray-100'>Total Visitors</h4>
                    <Icon icon="icon-park-outline:peoples-two" className="dahcx p-3 text-5xl rounded-full bg-green-500" />
                    <span className='text-4xl font-extrabold text-gray-700 dark:text-gray-100'>{numberFormat(totalVisitors)}</span>
                    <div className='flex items-center '>
                        {
                            percent.visitors > 0 ? <>
                                <Icon className='text-sm text-green-600 dark:text-green-400' icon="line-md:arrow-up" />
                                <span className="font-bold text-green-600 dark:text-green-400 text-sm">{percent.visitors.toFixed(0)}%</span>
                                <span className='font-semibold ml-2 text-xs text-gray-600 dark:text-gray-300'>Since last month</span>
                            </>
                                : <>
                                    <Icon className='text-sm text-red-600 dark:text-red-500' icon="line-md:arrow-up" rotate={90} />
                                    <span className="font-bold text-red-600 dark:text-red-500 text-sm">{Math.abs(percent.visitors).toFixed(0)}%</span>
                                    <span className='font-semibold ml-2 text-xs text-gray-600 dark:text-gray-300'>Since last month</span>
                                </>
                        }
                    </div>
                </Card>
                <Card className="card-kckx my-2 mx-2 px-4 shadow-sm relative">
                    <h4 className='font-bold text-xs text-gray-700 dark:text-gray-100'>Total Sells</h4>
                    <Icon icon="solar:tag-price-bold" className="dahcx p-3 text-5xl rounded-full bg-pink-500" />
                    <span className='text-4xl font-extrabold text-gray-700 dark:text-gray-100'>${numberFormat(totalSells)}</span>
                    <div className='flex items-center '>
                        {
                            percent.sells > 0 ? <>
                                <Icon className='text-sm text-green-600 dark:text-green-400' icon="line-md:arrow-up" />
                                <span className="font-bold text-green-600 dark:text-green-400 text-sm">{percent.sells.toFixed(0)}%</span>
                                <span className='font-semibold ml-2 text-xs text-gray-600 dark:text-gray-300'>Since last month</span>
                            </>
                                : <>
                                    <Icon className='text-sm text-red-600 dark:text-red-500' icon="line-md:arrow-up" rotate={90} />
                                    <span className="font-bold text-red-600 dark:text-red-500 text-sm">{Math.abs(percent.sells).toFixed(0)}%</span>
                                    <span className='font-semibold ml-2 text-xs text-gray-600 dark:text-gray-300'>Since last month</span>
                                </>
                        }
                    </div>
                </Card>
                <Card className="card-kckx my-2 mx-2 px-4 shadow-sm relative">
                    <h4 className='font-bold text-xs text-gray-700 dark:text-gray-100'>Total Purchase</h4>
                    <Icon icon="material-symbols:add-shopping-cart-rounded" className="dahcx p-3 text-5xl rounded-full bg-purple-600" />
                    <span className='text-4xl font-extrabold text-gray-700 dark:text-gray-100'>${numberFormat(totalPurchase)}</span>
                    <div className='flex items-center '>
                        {
                            percent.sells > 0 ? <>
                                <Icon className='text-sm text-green-600 dark:text-green-400' icon="line-md:arrow-up" />
                                <span className="font-bold text-green-600 dark:text-green-400 text-sm">{percent.purchase.toFixed(0)}%</span>
                                <span className='font-semibold ml-2 text-xs text-gray-600 dark:text-gray-300'>Since last month</span>
                            </>
                                : <>
                                    <Icon className='text-sm text-red-600 dark:text-red-500' icon="line-md:arrow-up" rotate={90} />
                                    <span className="font-bold text-red-600 dark:text-red-500 text-sm">{Math.abs(percent.purchase).toFixed(0)}%</span>
                                    <span className='font-semibold ml-2 text-xs text-gray-600 dark:text-gray-300'>Since last month</span>
                                </>
                        }
                    </div>
                </Card>
                <Card className="card-kckx my-2 mx-2 px-4 shadow-sm relative">
                    <h4 className='font-bold text-xs text-gray-700 dark:text-gray-100'>Registered Users</h4>
                    <Icon icon="ph:user-light" className="dahcx p-3 text-5xl rounded-full bg-green-500" />
                    <span className='text-4xl font-extrabold text-gray-700 dark:text-gray-100'>{numberFormat(data.users.length)}</span>
                    <div className='flex items-center '>
                        {
                            percent.users > 0 ? <>
                                <Icon className='text-sm text-green-600 dark:text-green-400' icon="line-md:arrow-up" />
                                <span className="font-bold text-green-600 dark:text-green-400 text-sm">{percent.users.toFixed(0)}%</span>
                                <span className='font-semibold ml-2 text-xs text-gray-600 dark:text-gray-300'>Since last month</span>
                            </>
                                : <>
                                    <Icon className='text-sm text-red-600 dark:text-red-500' icon="line-md:arrow-up" rotate={90} />
                                    <span className="font-bold text-red-600 dark:text-red-500 text-sm">{Math.abs(percent.users).toFixed(0)}%</span>
                                    <span className='font-semibold ml-2 text-xs text-gray-600 dark:text-gray-300'>Since last month</span>
                                </>
                        }
                    </div>
                </Card>
            </div>
            <div className='full-chart bg-white text-black dark:bg-gray-800 dark:text-gray-300'>
                <ChartVisitors visitors={data.visitors} />
            </div>
            <div className=' flex mb-8 '>
                <Card className='m-1 w-2/3'>
                    <h1 className='text-gray-700 dark:text-white text-base font-medium'>Top materials sells</h1>
                    <div className='flex items-center -mt-3 mb-5'>
                        <Icon icon="solar:tag-price-bold" className="mr-2 text-3xl text-pink-500" />
                        <span className='text-xl text-black dark:text-white'>{numberFormatChart(totalSells, 0, undefined, ',')}</span>
                    </div>
                    <TopSellsMatChart accessor={'totalSells'} label={'Sells'} chartType='column' materials={data.matSells} />
                </Card>
                <Card className='m-1 w-1/3'>
                    <h1 className='text-gray-700 dark:text-white text-base font-medium'>Top materials sells</h1>
                    <div className='flex items-center -mt-3 mb-5'>
                        <Icon icon="solar:tag-price-bold" className="mr-2 text-3xl text-pink-500" />
                        <span className='text-xl text-black dark:text-white'>{numberFormatChart(totalSells, 0, undefined, ',')}</span>
                    </div>
                    <TopSellsMatChart accessor={'totalPurchases'} chartType="spline" label={'Purchase'} materials={data.matPurchased} />
                </Card>
            </div>
            <div className='flex flex-wrap super-con'>
                <section className='m-1 bg-gray-100 shadow-md text-black dark:bg-gray-900 dark:text-white' >
                    <div className='chart' style={{ backgroundColor: '#217ae9' }}>
                        <ChartSells sells={data.sells} />
                    </div>
                    <div className='text'>
                        <h3>
                            7 Days Sells
                        </h3>
                        <p>
                            Overall Sells last 7 Days performance
                        </p>
                    </div>
                </section>
                <section className='m-1 bg-gray-100 shadow-md text-black dark:bg-gray-900 dark:text-white'>
                    <div className='chart' style={{ backgroundColor: '#5bb25f' }}>
                        <ChartUser users={data.users} />
                    </div>
                    <div className='text'>
                        <h3>
                            New users of last 12 Months
                        </h3>
                        <p>
                            New registered users of last 365 days
                        </p>
                    </div>
                </section>
                <section className='m-1 bg-gray-100 shadow-md text-black dark:bg-gray-900 dark:text-white'>
                    <div className='chart' style={{ backgroundColor: '#ff5622' }}>
                        <ChartPurchase purchases={data.purchases} />
                    </div>
                    <div className='text'>
                        <h3>
                            Last 28 Days Purchases
                        </h3>
                        <p>
                            new purchases of last 28 days
                        </p>
                    </div>
                </section>
            </div>
            <UsersComponent />
        </div>
    )
}
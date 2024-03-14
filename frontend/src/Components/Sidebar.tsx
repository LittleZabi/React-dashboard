import { Icon } from '@iconify/react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import StoreContext from '../context/store';

export default () => {
    const { User } = useContext(StoreContext)
    return (
        <div className="h-full rounded mr-4 fg-color w-1/5">
            <div className="profile">
                <div className='flex content-center items-center flex-col m-4'>
                    {User && User.avatar !== '' ?
                        <img src={User.avatar} alt="" className='profile-pic m-1 border-2 rounded-full border-gray-600' />
                        :
                        <Icon icon="ph:user-light" className="p-2 text-6xl m-1 border-2 rounded-full border-gray-600" />
                    }
                    <span>{User ? '@' + User.username : 'Login'}</span>
                </div>
            </div>
            <div className='m-2'>
                <Link to="/" className='flex fg-hover flex-row content-center items-center p-2  rounded'>
                    <Icon icon="mage:dashboard-chart-notification" className="text-2xl" />
                    <span className='ml-4'>Dashboard</span>
                </Link>
                <Link to="/users" className='flex fg-hover flex-row content-center items-center mt-1 p-2 rounded'>
                    <Icon icon="lets-icons:user-box-duotone" className="text-2xl" />
                    <span className='ml-4'>Users</span>
                </Link>
                <Link to="/materials" className='flex fg-hover flex-row content-center items-center mt-1 p-2 rounded'>
                    <Icon icon="simple-icons:materialformkdocs" />
                    <span className='ml-4'>Materials</span>
                </Link>
                <Link to="/sells" className='flex fg-hover flex-row content-center items-center mt-1 p-2 rounded'>
                    <Icon icon="la:sellsy" />
                    <span className='ml-4'>Sells</span>
                </Link>
                <Link to="/purchases" className='flex fg-hover flex-row content-center items-center mt-1 p-2 rounded'>
                    <Icon icon="bxs:purchase-tag" />
                    <span className='ml-4'>Purchases</span>
                </Link>
            </div>
        </div>
    )
}
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

export default () => {
    return (
        <div className="h-full rounded mr-4 fg-color w-1/5">
            <div className="profile">
                <div className='flex content-center items-center flex-col m-4'>
                    {/* <img src="" alt="" /> */}
                    <Icon icon="ph:user-light" className="p-2 text-6xl m-1 border-2 rounded-full border-gray-600" />
                    <span>LittleZabi</span>
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
            </div>
        </div>
    )
}
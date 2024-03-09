import ChartPurchase from '../charts/purchaseChart';
import ChartSells from '../charts/sellsChart';
import ChartUser from '../charts/usersChart';
import ChartVisitors from '../charts/visitorsChart';

export default () => {
    return (
        <div className="d-wrap">
            <h1 className='p-title'>
                Dashboard
            </h1>
            <div className='full-chart'>
                <ChartVisitors />
            </div>
            <div className='flex flex-wrap super-con'>
                <section className='m-1'>
                    <div className='chart' style={{ backgroundColor: '#217ae9' }}>
                        <ChartSells />
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
                <section className='m-1'>
                    <div className='chart' style={{ backgroundColor: '#5bb25f' }}>
                        <ChartUser />
                    </div>
                    <div className='text'>
                        <h3>
                            New Users
                        </h3>
                        <p>
                            New registered users of last month.
                        </p>
                    </div>
                </section>
                <section className='m-1'>
                    <div className='chart' style={{ backgroundColor: '#ff5622' }}>
                        <ChartPurchase />
                    </div>
                    <div className='text'>
                        <h3>
                            New Users
                        </h3>
                        <p>
                            New registered users of last month.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    )
}
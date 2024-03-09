import { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import { calculateTickPositions, prepareVisitorsByDay, prepareUsersPerMonth, prepareByDay } from '../utilities/utils';

const ChartPurchase = () => {
    const [seriesData, setSeriesData]: any = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/count/purchases');
                const data = await response.json();
                let c = prepareByDay(data)
                console.log('c => ', c)
                setSeriesData(c)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const chartOptions: any =
    {
        credits: {
            enabled: false
        },
        chart: {
            type: 'area',
            backgroundColor: '#ff5622',
            height: 150,
            style: {
                color: '#fff',
                fontFamily: 'sf_display_pro'
            }
        },
        plotBackgroundColor: null,
        title: null,
        subtitle: null,
        xAxis: {
            categories: seriesData.map((d: any) => d[0]),
            lineWidth: 0,
            gridLineWidth: 0,
            minorGridLineWidth: 0,
            labels: {
                style: {
                    color: '#fff',
                }
            }
        },
        yAxis: {
            gridLineWidth: 0.3,
            labels: {
                style: {
                    color: '#fff'
                }
            },
            title: {
                text: null
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    backgroundColor: 'transparent'
                },
                marker: {
                    radius: 0
                },
                lineWidth: 2,
                states: {
                    hover: {
                        lineWidth: 3
                    }
                },
                threshold: null
            }
        },

        series: [{
            type: 'line',
            name: 'New Users',
            data: seriesData.map((d: any) => d[1]),
            color: '#fff',
        }],
        accessibility: {
            enabled: true
        },
    };

    return (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
            />
        </div>
    );
};

export default ChartPurchase;

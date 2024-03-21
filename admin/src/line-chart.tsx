import { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock'; // Import Highcharts/Highstock version for datetime xAxis

const ChartComponent = () => {
    const [chartData, setChartData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000');
                const data = await response.json();
                console.log(data)
                setChartData(data);
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
            zoomType: 'x',
            backgroundColor: '#000000',
            style: {
                color: '#fff'
            }
        },
        title: {
            text: 'USD to EUR exchange rate over time',
            align: 'left',
            style: {
                color: '#fff'
            }
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in',
            align: 'left',
            style: {
                color: '#fff'
            }
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'Exchange rate'
            },
            gridLineWidth: 0
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, '#000'],
                        [1, 'rgba(0, 0, 255, 0)'],
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },

        series: [{
            type: 'area',
            name: 'USD to EUR',
            data: chartData,
            color: '#FFFF0090',
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

export default ChartComponent;

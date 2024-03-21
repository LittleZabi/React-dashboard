import { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import { prepareVisitorsByDay } from '../utilities/utils';

const ChartSells = ({ visitors }: any) => {
    const [seriesData, setSeriesData]: any = useState([[], []]);
    useEffect(() => {
        let c = prepareVisitorsByDay(visitors)
        if (c.length > 0)
            setSeriesData(c)
        else setSeriesData([[], []])
    }, [visitors]);

    const chartOptions: any =
    {
        credits: {
            enabled: false
        },
        chart: {
            type: 'spline',
            zoomType: 'x',
            backgroundColor: '#00000000',
            style: {
                color: '#fff',
                height: 300,
                fontFamily: 'sf_display_pro'
            },

        },
        title: {
            text: '',
        },
        subtitle: null,
        xAxis: {
            categories: seriesData.map((d: any) => d[0]),
            lineWidth: 0,
            gridLineWidth: 0,
            minorGridLineWidth: 0,
            labels: {
                formatter: (e: any) => {
                    return `<span style="color: #c0c0c0">${e.value}</span>`
                },
            },
        },
        yAxis: {
            gridLineWidth: 0.1,
            labels: {
                formatter: (e: any) => {
                    return `<span style="color: #c0c0c0">${e.value}</span>`
                },
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
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, 'rgba(255, 0, 143, 0.4)'],
                        [1, 'rgba(0, 0, 0, 0)'],
                    ]
                },
                lineWidth: 2,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },

        series: [{
            type: 'spline',
            name: 'Number of visitors',
            data: seriesData.map((d: any) => d[1]),
            color: 'dodgerblue',
            marker: {
                enabled: true, // Display markers
                symbol: 'circle', // Choose desired marker symbol
                radius: 2 // Adjust marker size
            }
        },
        {
            type: 'area',
            data: seriesData.map((d: any) => d[2]),
            color: '#ff0097',
            name: 'Number of unique visitors',
            marker: {
                symbol: 'circle',
                radius: 3
            }
        }
        ],
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

export default ChartSells;

import { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import { prepareUsersPerDay } from '../utilities/utils';

const ChartSells = ({ sells }: any) => {
    const [seriesData, setSeriesData]: any = useState([]);
    useEffect(() => {
        let c = prepareUsersPerDay(sells)
        setSeriesData(c)
    }, [sells]);

    const chartOptions: any =
    {
        credits: {
            enabled: false
        },
        chart: {
            type: 'column',
            backgroundColor: '#217ae9',
            height: 150,
            style: {
                color: '#fff',
                fontFamily: 'sf_display_pro'
            }
        },
        title: null,
        subtitle: null,
        xAxis: {
            categories: seriesData.map((d: any) => d[0]),
            lineWidth: 0,
            gridLineWidth: 0,
            minorGridLineWidth: 0,
            labels: {
                enabled: true,
                style: {
                    color: '#fff',
                    fontSize: 12
                }
            }
        },
        yAxis: {
            gridLineWidth: 0.3,
            labels: {
                style: {
                    color: '#fff',
                    fontSize: 11
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
            column: {
                pointPadding: 0.4,
                borderWidth: 0,
            }
        },
        series: [{
            name: 'Sells',
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

export default ChartSells;

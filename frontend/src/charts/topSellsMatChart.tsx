import { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';

export default ({ materials, accessor, chartType, label }: any) => {
    const [seriesData, setSeriesData]: any = useState([]);
    useEffect(() => {
        let y: any = []
        let x = [];
        for (let mat of materials) {
            if (mat[accessor]) {
                y.push(mat[accessor]);
                x.push(mat.name)
            }
        }
        setSeriesData([x, y])
    }, [materials]);

    const chartOptions: any =
    {
        credits: {
            enabled: false
        },
        chart: {
            type: chartType,
            backgroundColor: '#00000000',
            height: 250,
            style: {
                color: '#fff',
                fontFamily: 'sf_display_pro'
            }
        },
        title: null,
        subtitle: null,
        xAxis: {
            categories: seriesData[0],
            lineWidth: 1,
            gridLineWidth: 1,
            minorGridLineWidth: 1,
            gridLineColor: '#cfcfcf10',
            labels: {
                enabled: true,
                overflow: 'ellipsis',
                //@ts-ignore
                formatter: function () { // Function to format labels
                    //@ts-ignore
                    const label = this.value; // Get the original label text
                    const maxLength = seriesData[0].length > 5 ? 7 : 40; // Adjust the maximum character limit
                    return label.length > maxLength ? label.substring(0, maxLength) + '...' : label;
                },
                style: {
                    color: '#fff',
                    fontSize: 12,
                    textTransform: 'capitalize',
                    whiteSpace: 'nowrap'
                },
            }
        },
        yAxis: {
            gridLineWidth: 0.3,
            gridLineColor: '#cfcfcf',
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
                pointPadding: 0.5,
                borderWidth: 0,
            }
        },
        series: [{
            innerSize: '50%',
            name: label,
            data: seriesData[1],
            color: '#ff7a00',
            borderColor: '#ff9500',
            borderWidth: 2,
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


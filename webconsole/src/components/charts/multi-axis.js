import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {Card } from 'react-bootstrap'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  export const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: false,
        text: 'Multi Axis',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

export default function MultiAxis(props){
    return(
        <Card className="multi-axis-container">
            <Card.Header>{props.title} Sensor</Card.Header>
            <Card.Body>
                <Card.Text>
                   <Line   
                        options={options}
                        data={{
                            labels: props.labelkey,
                            datasets:[{
                                label: props.dataset1Label,
                                data: props.tempData,
                                borderColor: props.dataset1BorderColor,
                                backgroundColor: props.dataset1Color,
                                yAxisID: 'y',
                            },
                            {
                                label: props.dataset2Label,
                                data: props.humidityData,
                                borderColor: props.dataset2BorderColor,
                                backgroundColor: props.dataset2Color,
                                yAxisID: 'y1',
                            }
                        ]
                        }}

                   />
                </Card.Text>
            </Card.Body>
            </Card>
    )
}
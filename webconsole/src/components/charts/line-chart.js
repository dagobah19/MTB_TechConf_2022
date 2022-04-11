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
    responsive: true
  };

export default function LineChartDisplay(props){
    return(

            <Card className="line-chart-container">
            <Card.Header>{props.title} Sensor</Card.Header>
            <Card.Body>
                <Card.Text>
                    <Line 
                        options={options} 
                        data={{
                            labels:props.labelkey,
                            datasets:[{
                                data:props.datakey,
                                borderColor: 'rgb(53, 162, 235)',
                                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                                label:props.title
                            }]

                        }} />
                </Card.Text>
            </Card.Body>
            </Card>

    )
}
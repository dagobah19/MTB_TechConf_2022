import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import {Card } from 'react-bootstrap'

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieDisplay(props) {

    return (

            <Card className="chart-container">
            <Card.Header>{props.title} Sensor</Card.Header>
            <Card.Body>
                <Card.Text>
                    <Pie data={{
                    labels: [props.label1, props.label2],
                    datasets: [
                        {
                        label: props.title + ' Sensor',
                        data: props.datakey,
                        backgroundColor: [
                            props.color1,
                            props.color2,
                        ],
                        borderColor: [
                            props.border1,
                            props.border2,
                        ],
                        borderWidth: 1,
                        },
                    ]
                    }} />
                </Card.Text>
            </Card.Body>
            </Card>

    )
}
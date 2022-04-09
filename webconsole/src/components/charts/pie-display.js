import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import {Card, Col, Row } from 'react-bootstrap'

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieDisplay(props) {

    return (
    <Row>
        <Col>
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
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                        ],
                        borderWidth: 1,
                        },
                    ]
                    }} />
                </Card.Text>
            </Card.Body>
            </Card>
        </Col>
        <Col>
            <Card className="chart-container">
            <Card.Header>{props.title} Sensor</Card.Header>
            <Card.Body>
                <Card.Text>
                    <span>{props.label1}: {props.datakey[0]}</span>
                    <br/>
                    <span>{props.label2}: {props.datakey[1]}</span>
                </Card.Text>
            </Card.Body>
            </Card>
        </Col>
    </Row>
    )
}
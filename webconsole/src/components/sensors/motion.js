import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import {Card, Col, Row } from 'react-bootstrap'

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Motion(props) {

    return (
    <Row>
        <Col>
            <Card className="chart-container">
            <Card.Header>Motion Detector</Card.Header>
            <Card.Body>
                <Card.Text>
                    <Pie data={{
                    labels: ['Motion Detected', 'No Motion'],
                    datasets: [
                        {
                        label: 'Motion Sensor',
                        data: props.values.motionData,
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
            <Card.Header>Motion Detector</Card.Header>
            <Card.Body>
                <Card.Text>
                    <span>Motion Detected: {props.values.motionData[0]}</span>
                    <br/>
                    <span>No Motion Detected: {props.values.motionData[1]}</span>
                </Card.Text>
            </Card.Body>
            </Card>
        </Col>
    </Row>
    )
}
import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import {Card, Col } from 'react-bootstrap'
import ApiService from '../../services/api.service';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Motion() {


  const [sensorVals, setSensorVals] = useState({})
  useEffect(() => {
    ApiService.getSensorData('motion').then((response) => {
      var motion=0, nomotion=0
      response.data.data.forEach(vals=>{
        vals.data.motion==="true"?motion++:nomotion++;
      })
      setSensorVals([motion,nomotion])
    });
  }, []);

    return (
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
                      data: sensorVals,
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
    )
}
import {Container, Row, Table} from 'react-bootstrap'
import { Component } from 'react';
import { Link } from "react-router-dom"

class TableView extends Component{
    
    render(){
        const maxTableEntries = 10
        const {motionData,soundData,blinkData,distanceData,distanceLabels,climateLabels,climateHumidityData,climateTemperatureData} = this.props.state
        var distance = [];
        var climate = [];
        var i;

        for (i=0;i < distanceLabels.length;i++){
            distance[i]={timestamp:distanceLabels[i],distance:distanceData[i]}
        }
        distance = distance.slice(-maxTableEntries)

        for (i=0;i < climateLabels.length;i++){
            climate[i]={timestamp:climateLabels[i],temperature:climateTemperatureData[i],humidity:climateHumidityData[i]}
        }
        climate = climate.slice(-maxTableEntries)

        return(
            <Container fluid>
                <Row>
                    <h1>Sensor Console Table View</h1>
                    <Link to="/">Switch to Chart View</Link>
                </Row>
                <Row>
                <h2>Motion</h2>
                <Table striped bordered hover size="sm" className="motion-table">
                    <thead>
                        <tr>
                            <th>Event</th>
                            <th>Frequency</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Motion Detected</td>
                            <td>{motionData[0]}</td>
                        </tr>
                        <tr>
                            <td>No Motion Detected</td>
                            <td>{motionData[1]}</td>
                        </tr>
                    </tbody>
                </Table>
                <h2>Sound</h2>
                <Table striped bordered hover size="sm" className="sound-table">
                    <thead>
                        <tr>
                            <th>Event</th>
                            <th>Frequency</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Sound Detected</td>
                            <td>{soundData[0]}</td>
                        </tr>
                        <tr>
                            <td>No Sound Detected</td>
                            <td>{soundData[1]}</td>
                        </tr>
                    </tbody>
                </Table>
                <h2>Blink</h2>
                <Table striped bordered hover size="sm" className="blink-table">
                    <thead>
                        <tr>
                            <th>Event</th>
                            <th>Frequency</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Blink On</td>
                            <td>{blinkData[0]}</td>
                        </tr>
                        <tr>
                            <td>Blink Off</td>
                            <td>{blinkData[1]}</td>
                        </tr>
                    </tbody>
                </Table>
                <h2>Distance</h2>
                <Table striped bordered hover size="sm" className="distance-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Distance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            distance.map((vals,index)=>{return(
                                <tr key={index}>
                                    <td>{vals.timestamp}</td>
                                    <td>{vals.distance} in</td>
                                </tr>
                            )})

                        }
                    </tbody>
                </Table>
                <h2>Climate</h2>
                <Table striped bordered hover size="sm" className="climate-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Temperature</th>
                            <th>Humidity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            climate.map((vals,index)=>{return(
                                <tr key={index}>
                                    <td>{vals.timestamp}</td>
                                    <td>{vals.temperature} &#8457;</td>
                                    <td>{vals.humidity}%</td>
                                </tr>
                            )})

                        }
                    </tbody>
                </Table>
                </Row>
            </Container>
        )
    }
}

export default TableView;
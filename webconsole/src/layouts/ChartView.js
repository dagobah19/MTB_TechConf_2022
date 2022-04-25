
import PieDisplay from '../components/charts/pie-display'
import LineChartDisplay from '../components/charts/line-chart';
import MultiAxis from '../components/charts/multi-axis';
import {Container, Row} from 'react-bootstrap'
import { Component } from 'react';
import { Link } from "react-router-dom"

class ChartView extends Component {
   
    render(){
        const {motionData,soundData,blinkData,distanceData,distanceLabels,climateLabels,climateHumidityData,climateTemperatureData} = this.props.state
        return (
            <Container fluid>
                <Row>
                    <h1>Sensor Console Chart View</h1>
                    <Link to="/table">Switch to Table View</Link>
                </Row>
                <Row>
                    <PieDisplay 
                        title = 'Motion'
                        label1 = 'Motion Detected'
                        label2 = 'No Motion Detected'
                        color1 = 'rgba(255, 99, 132, 0.2)'
                        border1 = 'rgba(255, 99, 132, 1)'
                        color2 = 'rgba(54, 162, 235, 0.2)'
                        border2 = 'rgba(54, 162, 235, 1)'
                        datakey = {motionData}
                    />
                    <PieDisplay 
                        title = 'Sound'
                        label1 = 'Sound Detected'
                        label2 = 'No Sound Detected'
                        color1 = 'rgba(75, 192, 192, 0.2)'
                        border1 = 'rgba(75, 192, 192, 1)'
                        color2 = 'rgba(53, 162, 235, 0.2)'
                        border2 = 'rgba(53, 162, 235, 1)'
                        datakey = {soundData}
                    />
                    <PieDisplay 
                        title = 'Blink'
                        label1 = 'Blink on'
                        label2 = 'Blink off'
                        color1 = 'rgba(153, 102, 255, 0.2)'
                        border1 = 'rgba(153, 102, 255, 1)'
                        color2 = 'rgba(255, 159, 64, 0.2)'
                        border2 = 'rgba(255, 159, 64, 1)'
                        datakey = {blinkData}
                    />
                    <LineChartDisplay
                        title='Distance'
                        border = 'rgb(53, 162, 235)'
                        background = 'rgba(53, 162, 235, 0.5)'
                        datakey={distanceData}
                        labelkey={distanceLabels}
                    />
                    <MultiAxis
                        title='Climate'
                        labelkey = {climateLabels}
                        dataset1Label = 'Temperature'
                        dataset1BorderColor = 'rgb(255, 99, 132)'
                        dataset1Color = 'rgba(255, 99, 132, 0.5)'
                        dataset2Label = 'Humidity'
                        dataset2BorderColor = 'rgb(53, 162, 235)'
                        dataset2Color = 'rgba(53, 162, 235, 0.5)'
                        tempData = {climateTemperatureData}
                        humidityData = {climateHumidityData}
                    />
                </Row>
            </Container>
        )
    }
}
export default ChartView;
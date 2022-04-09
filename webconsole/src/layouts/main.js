
import PieDisplay from '../components/charts/pie-display'
import LineChartDisplay from '../components/charts/line-chart';
import {Container, Row} from 'react-bootstrap'
import { Component } from 'react';
import ApiService from '../services/api.service';
import { w3cwebsocket as websocket } from 'websocket';

const client = new websocket('ws://localhost:3006')

class Main extends Component {

    constructor(){
        super()
        this.state = {
            motionData:[0,0],
            temperatureLabels:[],
            temperatureData:[]
        }

    }

    componentDidMount(){
        //get all the sensors
        ApiService.getSensorList().then((response)=>{
            response.data.forEach(vals=>{
                //console.log(vals.sensor_name)
            })
        })

        ApiService.getSensorData('motion').then((response) => {
            var motion=0, nomotion=0
            response.data.data.forEach(vals=>{
              vals.data.motion==="true"?motion++:nomotion++;
            })
            this.setState({motionData:[motion,nomotion]})
      
          });
        
        ApiService.getSensorData('temperature').then((response)=>{
            response.data.data.forEach(vals=>{
                this.setState({
                    temperatureLabels:[...this.state.temperatureLabels,vals.timestamp],
                    temperatureData:[...this.state.temperatureData,vals.data.temperature]
                })
            })
        })



        client.onopen = () => {
          console.log('websocket connected')
        };
        client.onmessage = (message) => {
          const dataFromServer = JSON.parse(message.data);
          switch(dataFromServer.sensor){
              case('motion'):
                var motion=0,nomotion=0
                dataFromServer.data.forEach(vals=>{
                    vals.data.motion==="true"?motion++:nomotion++;
                })
                this.setState({motionData:[motion,nomotion]})
                break;
              case('temperature'):
                this.setState({
                    temperatureData:[],
                    temperatureLabels:[]
                })
                dataFromServer.data.forEach(vals=>{
                    this.setState({
                        temperatureLabels:[...this.state.temperatureLabels,vals.timestamp],
                        temperatureData:[...this.state.temperatureData,vals.data.temperature]
                    })
                })
              break;
              default:
                  break;
          }
        }
      }

    render(){
        const {motionData} = this.state
        const values = {motionData}
        return (
            <Container fluid>
                <Row>
                    <h1>Sensor Console View</h1>
                </Row>
                <Row id="dataDisplay">
                <PieDisplay 
                    title = 'Motion'
                    label1 = 'Motion Detected'
                    label2 = 'No Motion Detected'
                    datakey = {values.motionData}
                />
                </Row>
                <Row>
                    <LineChartDisplay
                        title='Temperature'
                        datakey={this.state.temperatureData}
                        labelkey={this.state.temperatureLabels}
                    />
                </Row>
            </Container>
        )
    }
}
export default Main;
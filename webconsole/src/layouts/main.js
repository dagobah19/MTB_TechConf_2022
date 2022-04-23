
import PieDisplay from '../components/charts/pie-display'
import LineChartDisplay from '../components/charts/line-chart';
import {Container, Row} from 'react-bootstrap'
import { Component } from 'react';
import ApiService from '../services/api.service';
import { w3cwebsocket as websocket } from 'websocket';

const client = new websocket(process.env.REACT_APP_SOCKET_URL)

class Main extends Component {

    constructor(){
        super()
        this.state = {
            showAllSensors:false,
            allSensors:[],
            motionData:[0,0],
            temperatureLabels:[],
            temperatureData:[]
        }

    }

    componentDidMount(){
        //get all the sensors
        ApiService.getSensorList().then((response)=>{
            response.data.forEach(vals=>{
                this.setState({
                    allSensors:[...this.state.allSensors,vals.sensor_name]
                })
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
                let date = new Date(vals.timestamp)
                let timestring = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
                this.setState({
                    temperatureLabels:[...this.state.temperatureLabels,timestring],
                    temperatureData:[...this.state.temperatureData,vals.data.temperature]
                })
            })
        })

        //connect to websocket
        this.wsconnection()

      }

    wsconnection = () => {
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
                        let date = new Date(vals.timestamp)
                        let timestring = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
                        this.setState({
                            temperatureLabels:[...this.state.temperatureLabels,timestring],
                            temperatureData:[...this.state.temperatureData,vals.data.temperature]
                        })
                    })
                    break;
                default:
                    break;
            }
        }

        client.onclose = e => {
            console.log("Socket has been closed: "+e.reason)
        }

        client.onerror = err => {
            console.error(err.message + " - Closing websocket");
            client.close();
        }
        
    }

    componentWillUnmount(){
        client.close = () =>{
            //close connection on unmount
            console.log("disconnected websocket connection") 
        }
    }
      
    render(){
        const {motionData,temperatureData,temperatureLabels} = this.state
        return (
            <Container fluid>
                <Row>
                    <h1>Sensor Console View</h1>
                </Row>
                <Row>
                    <PieDisplay 
                        title = 'Motion'
                        label1 = 'Motion Detected'
                        label2 = 'No Motion Detected'
                        datakey = {motionData}
                    />
                    <LineChartDisplay
                        title='Temperature'
                        datakey={temperatureData}
                        labelkey={temperatureLabels}
                    />
                </Row>
            </Container>
        )
    }
}
export default Main;
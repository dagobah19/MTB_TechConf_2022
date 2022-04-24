
import PieDisplay from '../components/charts/pie-display'
import LineChartDisplay from '../components/charts/line-chart';
import MultiAxis from '../components/charts/multi-axis';
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
            soundData:[0,0],
            blinkData:[0,0],
            distanceLabels:[],
            distanceData:[],
            climateLabels:[],
            climateHumidityData:[],
            climateTemperatureData:[]
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

        ApiService.getSensorData('sound').then((response) => {
            var sound=0, nosound=0
            response.data.data.forEach(vals=>{
              vals.data.sound==="true"?sound++:nosound++;
            })
            this.setState({soundData:[sound,nosound]})
      
          });

        ApiService.getSensorData('blink').then((response) => {
            var blink=0, noblink=0
            response.data.data.forEach(vals=>{
              vals.data.blink==="true"?blink++:noblink++;
            })
            this.setState({blinkData:[blink,noblink]})
      
          });
        ApiService.getSensorData('distance').then((response)=>{
            response.data.data.forEach(vals=>{
                let date = new Date(vals.timestamp)
                let timestring = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
                this.setState({
                    distanceLabels:[...this.state.distanceLabels,timestring],
                    distanceData:[...this.state.distanceData,vals.data.distance]
                })
            })
            this.setState({
                distanceLabels:this.state.distanceLabels.reverse(),
                distanceData:this.state.distanceData.reverse()
            })
        })

        ApiService.getSensorData('climate').then((response)=>{
            response.data.data.forEach(vals=>{
                let date = new Date(vals.timestamp)
                let timestring = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
                this.setState({
                    climateLabels:[...this.state.climateLabels,timestring],
                    climateTemperatureData:[...this.state.climateTemperatureData,vals.data.temp],
                    climateHumidityData:[...this.state.climateHumidityData,vals.data.humidity]
                })
            })
            this.setState({
                climateLabels:this.state.climateLabels.reverse(),
                climateTemperatureData:this.state.climateTemperatureData.reverse(),
                climateHumidityData:this.state.climateHumidityData.reverse()
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
                case('sound'):
                    var sound=0,nosound=0
                    dataFromServer.data.forEach(vals=>{
                        vals.data.sound==="true"?sound++:nosound++;
                    })
                    this.setState({soundData:[sound,nosound]})
                    break;
                case('blink'):
                    var blink=0,noblink=0
                    dataFromServer.data.forEach(vals=>{
                        vals.data.blink==="true"?blink++:noblink++;
                    })
                    this.setState({blinkData:[blink,noblink]})
                    break;
                case('distance'):
                    this.setState({
                        distanceData:[],
                        distanceLabels:[]
                    })
                    dataFromServer.data.forEach(vals=>{
                        let date = new Date(vals.timestamp)
                        let timestring = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
                        this.setState({
                            distanceLabels:[...this.state.distanceLabels,timestring],
                            distanceData:[...this.state.distanceData,vals.data.distance]
                        })
                    })
                    this.setState({
                        distanceLabels:this.state.distanceLabels.reverse(),
                        distanceData:this.state.distanceData.reverse()
                    })
                    break;
                case('climate'):
                    this.setState({
                        climateLabels:[],
                        climateHumidityData:[],
                        climateTemperatureData:[]
                    })
                    dataFromServer.data.forEach(vals=>{
                        let date = new Date(vals.timestamp)
                        let timestring = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
                        this.setState({
                            climateLabels:[...this.state.climateLabels,timestring],
                            climateTemperatureData:[...this.state.climateTemperatureData,vals.data.temp],
                            climateHumidityData:[...this.state.climateHumidityData,vals.data.humidity]
                        })
                    })
                    this.setState({
                        climateLabels:this.state.climateLabels.reverse(),
                        climateTemperatureData:this.state.climateTemperatureData.reverse(),
                        climateHumidityData:this.state.climateHumidityData.reverse()
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
        const {motionData,soundData,blinkData,distanceData,distanceLabels,climateLabels,climateHumidityData,climateTemperatureData} = this.state
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
export default Main;

import  { Component } from 'react';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom"
import './App.css';
import ChartView from './layouts/ChartView';
import TableView from './layouts/TableView';
import ApiService from './services/api.service';
import { w3cwebsocket as websocket } from 'websocket';

const client = new websocket(process.env.REACT_APP_SOCKET_URL)

class App extends Component {

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
    return (
      <Router>
        <Routes>
          <Route exact path="/" element={<ChartView state = {{...this.state}} />} />
          <Route exact path="/table" element={<TableView state = {{...this.state}}/>} />
        </Routes>
      </Router>
      
    );
  }
}

export default App;


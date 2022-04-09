
import Motion from '../components/sensors/motion'
import {Container, Row} from 'react-bootstrap'
import { Component } from 'react';
import ApiService from '../services/api.service';
import { w3cwebsocket as websocket } from 'websocket';

const client = new websocket('ws://localhost:3006')

class Main extends Component {

    constructor(){
        super()
        this.state = {
            motionData:[0,0]
        }

    }

    componentDidMount(){
        ApiService.getSensorData('motion').then((response) => {
            var motion=0, nomotion=0
            response.data.data.forEach(vals=>{
              vals.data.motion==="true"?motion++:nomotion++;
            })
            this.setState({motionData:[motion,nomotion]})
      
          });



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
                    Welcome
                </Row>
                <Row id="dataDisplay">
                <Motion 
                    values = {values}
                />
                </Row>
            </Container>
        )
    }
}
export default Main;
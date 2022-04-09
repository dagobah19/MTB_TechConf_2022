import http from '../components/http-common'

class ApiService {
    //define the operations needed - CRUD
    getSensorData(sensor) {
        return http.get(`http://localhost:3005/sensordata/${sensor}`);
    }

    getSensorList(){
        return http.get(`http://localhost:3005/sensors`);
    }

}

export default new ApiService();
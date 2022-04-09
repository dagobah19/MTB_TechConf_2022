import http from '../components/http-common'

class ApiService {
    //define the operations needed - CRUD
    getSensorData(sensor) {
        return http.get(`http://localhost:3005/sensordata/${sensor}`);
    }

}

export default new ApiService();
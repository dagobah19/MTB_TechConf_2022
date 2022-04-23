import http from '../components/http-common'

class ApiService {
    //define the operations needed - CRUD
    getSensorData(sensor) {
        return http.get(`${process.env.REACT_APP_API_URL}/sensordata/${sensor}`);
    }

    getSensorList(){
        return http.get(`${process.env.REACT_APP_API_URL}/sensors`);
    }

}

export default new ApiService();
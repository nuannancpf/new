import axios from "axios";
import qs from 'qs';    

const instance = axios.create({
    baseURL: "http://118.89.191.110:5454",
    transformRequest: [function (data, headers) {
        return qs.stringify(data);
    }],
})


export default instance;


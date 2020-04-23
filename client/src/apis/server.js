import axios from 'axios';

axios.interceptors.response.use(response => {
    return response;
 }, error => {
   return error;
 });
axios.defaults.withCredentials = true;

export default axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 50000,
    credentials: "include",
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
    },
});
import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 50000,
    credentials: "include",
    headers: {
        'WWW-Authenticate': 'User with this email already exist',
        'X-Powered-By': 'Express',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        "Access-Control-Allow-Credentials": true,
    },
});
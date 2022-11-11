import axios from 'axios';

const requestHeader = {
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*"
};

export function getUserInfoCall(netId){
    return axios.get(`http://127.0.0.1:5000/vi/users/user/${netId}`, { headers: requestHeader });
};

export function updateUserInfoCall(requestBody){
    return axios.put(`http://127.0.0.1:5000/vi/users/user`, requestBody , { headers: requestHeader});
};

export function deleteUserCall(netId){
    return axios.delete(`http://127.0.0.1:5000/vi/users/user/${netId}`, { headers: requestHeader });
};
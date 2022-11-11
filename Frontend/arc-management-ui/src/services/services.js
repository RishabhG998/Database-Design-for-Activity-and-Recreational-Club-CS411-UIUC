import axios from 'axios';

const requestHeader = {
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*"
};

const baseUrl = "http://127.0.0.1:5000/v1"
export function getUserInfoCall(netId){
    return axios.get(`${baseUrl}/users/user/${netId}`, { headers: requestHeader });
};

export function updateUserInfoCall(requestBody){
    return axios.put(`${baseUrl}/users/user`, requestBody , { headers: requestHeader});
};

export function deleteUserCall(netId){
    return axios.delete(`${baseUrl}/users/user/${netId}`, { headers: requestHeader });
};

export function getAllSportsCall(){
    return axios.get(`${baseUrl}/sports/sports`, { headers: requestHeader });
};

export function getFacilitesForSportCall(sportId){
    return axios.get(`${baseUrl}/facilities/facility?facility_id=-1&sport_id=${sportId}&regex_check=false`, { headers: requestHeader });
};

export function getSlotsForFacilityCall(facilityId, date){
    return axios.get(`${baseUrl}/slots/facility?facility_id=${facilityId}&date=${date}`, { headers: requestHeader });
};

export function bookFacilitySlotCall(requestBody){
    return axios.post(`${baseUrl}/slots/book_slot`, requestBody, { headers: requestHeader });
};
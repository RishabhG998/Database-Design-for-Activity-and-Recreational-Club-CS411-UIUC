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

export function getSportsStats(sportId){
    return axios.get(`${baseUrl}/adv_query/sport_statistics?sport_id=${sportId}&start_date=2022-08-22&end_date=2022-10-22`);
};

export function getProfitableEvents(){
    return axios.get(`${baseUrl}/adv_query/profitable_events`);
};

export function getEquipmentsForSportCall(sportId){
    return axios.get(`${baseUrl}/equipments/equipment?equipment_id=-1&sport_id=${sportId}&regex_check=false`, { headers: requestHeader });
};

export function getAllAvailableSlots(date){
    return axios.get(`${baseUrl}/slots/available_slots/${date}`, { headers: requestHeader });    
};

export function bookEquipmentSlotCall(requestBody){
    return axios.post(`${baseUrl}/equipmentbookings/equipmentbooking`, requestBody, { headers: requestHeader });
};

export function createEventCall(requestBody){
    return axios.post(`${baseUrl}/events/events`, requestBody , { headers: requestHeader});

};

export function getTicketsSoldPerEventCall() {
    return axios.get(`${baseUrl}/adv_query/get_tickets_sold_per_event`);
};

export function getBookingsPerDayCall() {
    return axios.get(`${baseUrl}/adv_querybookings_by_weekday`);
};

export function getTotalBookingsCall() {
    return axios.get(`${baseUrl}/adv_query/get_total_bookings`);
};

export function getTotalEventsAndTicketsSoldCall() {
    return axios.get(`${baseUrl}/adv_query/get_total_events_and_tickets_sold`);
};

export function getTotalRevenueEarnedCall() {
    return axios.get(`${baseUrl}/adv_query/get_total_revenue`);
};

export function getUserKundaliCall(netId) {
    return axios.get(`${baseUrl}/adv_query/get_user_kundali/${netId}`, { headers: requestHeader });
};

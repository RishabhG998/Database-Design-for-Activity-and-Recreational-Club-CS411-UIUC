import { 
    getUserInfoCall, 
    updateUserInfoCall, 
    deleteUserCall, 
    getAllSportsCall, 
    getFacilitesForSportCall, 
    getSlotsForFacilityCall,
    bookFacilitySlotCall } from "../services/services";

export async function  getUserInfo(netId) {
    return getUserInfoCall(netId).then((response) => {
        const userData = response.data;
        return {
            type: "USER_INFO_FETCH",
            payload: {
                netId: userData["net_id"],
                name: userData["name"],
                roleID: userData["role_id"],
                contactNumber: userData["contact_number"],
                emailID: userData["email_id"],
                dob: userData["date_of_birth"]
            }
        }
    });
};

export async function updateUserInfo(userInfo) {
    const requestBody = {
        "net_id": userInfo.netId,
        "name": userInfo.name,
        "contact_number": userInfo.contactNumber,
        "email_id": userInfo.emailID,
        "date_of_birth": userInfo.dob.toString(),
        "role_id": userInfo.roleID.toString()
    };
    return updateUserInfoCall(requestBody).then((response) => {
        return {
            type: "USER_INFO_UPDATE"
        }
    });   
};

export function deleteUser(netId) {
    return deleteUserCall(netId).then((response) => {
        return {
            type: "USER_DELETE"
        }
    });
};

export function resetUserInfo() {
    return {
        type: "RESET_USER_INFO"
    }
};

export function fetchingProgress(isFetchingProgress) {
    return {
        type: "FETCHING_STATUS_CHANGE",
        payload: isFetchingProgress
    }
};

export function userLogin(netid, password) {
    return getUserInfoCall(netid).then((response) => {
        const userData = response.data;
        const roleName = userData["role_name"];
        return {
            type: "SET_USER_ROLE",
            payload: {roleName, netid}
        }
    });
};

export async function getAllSports(){
    return getAllSportsCall().then((response) => {
        const allSports = response.data;
        const transformedSports = allSports && allSports.length>0 && allSports.map(sport => {
            return { sportId: sport.sport_id, sportName: sport.sport_name }
        });
        return {
            type: "ALL_SPORTS_FETCH",
            payload: transformedSports  
        }
    });    
};

export async function getFacilitiesForSport(sportId){
    return getFacilitesForSportCall(sportId).then((response) => {
        const allFacilitiesOfSport = response.data;
        const transformedFacilites = allFacilitiesOfSport && allFacilitiesOfSport.length>0 && allFacilitiesOfSport.map(facility =>{
            return { facilityId: facility.facility_id, facilityName: facility.facility_name };
        });
        return {
            type: "FACILITES_FOR_SPORT_FETCH",
            payload: transformedFacilites  
        }
    });    
};

export function resetFacilitiesForSport() {
    return {
        type: "RESET_FETCHED_FACILITIES"
    }
};

export async function getSlotsForFacility(facilityId, date){
    return getSlotsForFacilityCall(facilityId, date).then((response) => {
        const allSlotsForFacility = response.data;
        const transformedSlots = allSlotsForFacility && allSlotsForFacility.length>0 && allSlotsForFacility.map(slot => {
            return {
                slotId: slot["available_slot_id"],
                slot: slot["start_time"] + " to " + slot["end_time"]
            }
        });
        return {
            type: "SLOTS_FOR_FACILITY_FETCH",
            payload: transformedSlots  
        };
    }); 
};

export function resetslotsForFacility() {
    return {
        type: "RESET_FETCHED_FACILITY_SLOTS"
    }
};

export function bookFacilitySlot(requestBody) {
    const reqBody = {
        net_id: requestBody.netId,
        facility_id : requestBody.facilityId,
        slot_id : requestBody.slotId,
        booking_date: (new Date()).toJSON().substring(0,10)
    };
    return bookFacilitySlotCall(reqBody).then((response) => {
        return {
            type: "BOOK_FACILITY_SLOT"
        };
    }); 
};

export async function getEquipmentsForSport(sportId){
    const mockEquipments = [
        {equipmentId: 1, equipmentName: "Badminton Racquet"},
        {equipmentId: 2, equipmentName: "Badminton Shuttle"},
    ];
    return {
        type: "EQUIPMENT_FOR_SPORT_FETCH",
        payload: mockEquipments  
    }
};

export function resetEquipmentsForSport() {
    return {
        type: "RESET_FETCHED_EQUIPMENTS"
    }
};

export async function getSlotsForEquipment(equipmentId, date){
    const mockSlots = [
        {slotId: 1, slot: "12:00 to 13:00"},
        {slotId: 2, slot: "15:00 to 16:00"}
    ];
    return {
        type: "SLOTS_FOR_EQUIPMENT_FETCH",
        payload: mockSlots  
    };
};

export function resetslotsForEquipment() {
    return {
        type: "RESET_FETCHED_EQUIPMENT_SLOTS"
    }
};

export function bookEquipmentSlot(requestBody) {
    return {
        type: "BOOK_EQUIPMENT_SLOT"
    };
};

export function getAdvQuery1Results() {
    const mockQuery1Results = [
        { userName: "Saket", timeSpent: "22" },
        { userName: "Rishabh", timeSpent: "100" },
        { userName: "Chinmay", timeSpent: "80" },
        { userName: "Kedar", timeSpent: "80" },
        { userName: "Bruce", timeSpent: "78" },
    ];
    return {
        type: "ADV_QUERY_1_RESULTS",
        payload: mockQuery1Results
    };
};

// date: yyyy-mm-dd
// time: yyyy-mm-dd hh:mm:ss
export function userNameChange(userName) {
    return {
        type: "USER_NAME_CHANGE",
        payload: userName
    }
};

export function setLoggedInUserRole(role) {
    return {
        type: "SET_USER_ROLE",
        payload: role
    }
};

export async function  getUserInfo(netId) {
    const mockUserInfo = {
        netId: netId,
        name: "kedar",
        roleID: 1,
        contactNumber: "4534787964",
        emailID: "kedar@uiuc.edu",
        dob: "1997-10-26"
    };
    return {
        type: "USER_INFO_FETCH",
        payload: mockUserInfo
    };
};

export function updateUserInfo(userInfo) {
    return {
        type: "USER_INFO_UPDATE"
    };
};

export function deleteUser() {
    return {
        type: "USER_DELETE"
    };
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

export function loginCreds(netid, password) {
    console.log("(netid, password): (", netid, ", ", password, ")");
    return {
        type: "LOGIN_CREDS",
        payload_netid: netid,
        payload_password: password
    }
};

export async function getAllSports(){
    const mockSports = [
        {sportId: 1, sportName: "BasketBall"},
        {sportId: 2, sportName: "Badminton"},
    ]; 
    return {
        type: "ALL_SPORTS_FETCH",
        payload: mockSports  
    }
};

export async function getFacilitiesForSport(sportId){
    const mockFacilities = [
        {facilityId: 1, facilityName: "BasketBall Court 1"},
        {facilityId: 2, facilityName: "BasketBall Court 2"},
    ];
    return {
        type: "FACILITES_FOR_SPORT_FETCH",
        payload: mockFacilities  
    }
};

export function resetFacilitiesForSport() {
    return {
        type: "RESET_FETCHED_FACILITIES"
    }
};

export async function getSlotsForFacility(facilityId, date){
    const mockSlots = [
        {slotId: 1, slot: "12:00 to 13:00"},
        {slotId: 2, slot: "15:00 to 16:00"},
    ];
    return {
        type: "SLOTS_FOR_FACILITY_FETCH",
        payload: mockSlots  
    };
};

export function resetslotsForFacility() {
    return {
        type: "RESET_FETCHED_SLOTS"
    }
};

export function bookFacilitySlot(requestBody) {
    return {
        type: "BOOK_FACILITY_SLOT"
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
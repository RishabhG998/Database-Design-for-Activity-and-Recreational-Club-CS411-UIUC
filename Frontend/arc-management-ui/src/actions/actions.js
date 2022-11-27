import { 
    getUserInfoCall, 
    updateUserInfoCall, 
    deleteUserCall, 
    getAllSportsCall, 
    getFacilitesForSportCall, 
    getSlotsForFacilityCall,
    bookFacilitySlotCall,
    getSportsStats,
    getProfitableEvents,
    getEquipmentsForSportCall,
    getAllAvailableSlots,
    bookEquipmentSlotCall,
    createEventCall,
    getTicketsSoldPerEventCall,
    getBookingsPerDayCall,
    getTotalBookingsCall,
    getTotalEventsAndTicketsSoldCall,
    getTotalRevenueEarnedCall } from "../services/services";

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
    return getEquipmentsForSportCall(sportId).then((response) => {
        const allEquipmentsOfSport = response.data;
        const transformedEquipments = allEquipmentsOfSport && allEquipmentsOfSport.length>0 && allEquipmentsOfSport.map(equipment =>{
            return { equipmentId: equipment.equipment_id, equipmentName: equipment.equipment_name };
        });
        return {
            type: "EQUIPMENT_FOR_SPORT_FETCH",
            payload: transformedEquipments  
        }
    }); 
};

export function resetEquipmentsForSport() {
    return {
        type: "RESET_FETCHED_EQUIPMENTS"
    }
};

export async function getSlotsForEquipment(date){
    return getAllAvailableSlots(date).then((response) => {
        const allSlotsForDate = response.data;
        const transformedSlots = allSlotsForDate && allSlotsForDate.length>0 && allSlotsForDate.map(slot => {
            return {
                slotId: slot["available_slot_id"],
                slot: slot["start_time"] + " to " + slot["end_time"]
            }
        });
        return {
            type: "SLOTS_FOR_EQUIPMENT_FETCH",
            payload: transformedSlots  
        };
    });
};

export function resetslotsForEquipment() {
    return {
        type: "RESET_FETCHED_EQUIPMENT_SLOTS"
    }
};

export function bookEquipmentSlot(requestBody) {
    const reqBody = {
        net_id: requestBody.netId,
        equipment_id : requestBody.equipmentId,
        slot_id : requestBody.slotId.toString(),
        rent_date : (new Date()).toJSON().substring(0,10),
        equipment_count: parseInt(requestBody.equipmentCount)
    };
    return bookEquipmentSlotCall(reqBody).then((response) => {
        return {
            type: "BOOK_EQUIPMENT_SLOT"
        };
    }); 
};

export function getAdvQuery1Results(sportId) {
    return getSportsStats(sportId).then((response) => {
        const stats = response.data;
        const formattedStats = stats.map(stat => {
            return {
                userName: stat.NET_ID,
                timeSpent: stat.TOTAL_HOURS_SPENT
            }
        });
        return {
            type: "ADV_QUERY_1_RESULTS",
            payload: formattedStats
        };
    });
};

export function getAdvQuery2Results() {
    return getProfitableEvents().then((response) => {
        const stats = response.data;
        const formattedStats = stats.map(stat => {
            return {
                eventName: stat.event_name,
                amountReceived: stat.total_val
            }
        });
        return {
            type: "ADV_QUERY_2_RESULTS",
            payload: formattedStats
        };
    });
};

export function getTicketsSoldPerEventResults() {
    return getTicketsSoldPerEventCall().then((response) => {
        const stats = response.data;
        const formattedStats = stats.map(stat => {
            return {
                eventName: stat.event_name,
                totalTicketsSold: stat.total_tickets_sold
            }
        });
        return {
            type: "ADV_TICKETS_SOLD_PER_EVENT",
            payload: formattedStats
        };
    });
};

export function getBookingsPerDayResults() {
    return getBookingsPerDayCall().then((response) => {
        const stats = response.data;
        const formattedStats = stats.map(stat => {
            return {
                weekDay: stat.week_day,
                totalBookings: stat.total_bookings
            }
        });
        return {
            type: "ADV_BOOKINGS_PER_DAY",
            payload: formattedStats
        };
    });
};

export function getTotalBookings() {
    return getTotalBookingsCall().then((response) => {
        const stats = response.data;

        return {
            type: "ADV_TOTAL_BOOKINGS",
            payload: {totalBookings: stats.total_bookings}
        };
    });
};

export function getTotalEventsAndTicketsSold() {
    return getTotalEventsAndTicketsSoldCall().then((response) => {
        const stats = response.data;

        return {
            type: "ADV_TOTAL_EVENTS_TICKETS_SOLD",
            payload: {
                totalEvents: stats.total_events,
                totalTicketsSold: stats.total_tickets_sold
            }
        };
    });
};

export function getTotalRevenueEarned() {
    return getTotalRevenueEarnedCall().then((response) => {
        const stats = response.data;

        return {
            type: "ADV_TOTAL_REVENUE_EARNED",
            payload: {
                totalRevenue: stats.total_revenue,
            }
        };
    });
};

export async function createEvent(requestBody) {

    return createEventCall(requestBody).then((response) => {
        return {
            type: "EVENT_CREATE"
        }
    });   
};

// date: yyyy-mm-dd
// time: yyyy-mm-dd hh:mm:ss
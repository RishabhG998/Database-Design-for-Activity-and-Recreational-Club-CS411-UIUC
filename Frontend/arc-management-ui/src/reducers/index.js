const initialState = {
    loggedInUserRole: null,
    netid: null,
    selectedFacility: null,
    selectedSport: null,
    fetchingProgressStatus: false,
    userInfo: null,
    allRoles: { "User": 1,  "Administrator": 2, "Supervisor":3 },
    allSports: [],
    facilitiesForSport: [],
    slotsForFacility: [],
    equipmentsForSport: [],
    slotsForEquipment: [],
    advQuery2Results: []
  }
  
  // Use the initialState as a default value
  // eslint-disable-next-line import/no-anonymous-default-export
  export default (state = initialState, action) => {
    // The reducer normally looks at the action type field to decide what happens
    switch (action.type) {
      case "SET_USER_ROLE":
        return {
          ...state,
          loggedInUserRole: action.payload.roleName,
          netid: action.payload.netid
        };
      case "FETCHING_STATUS_CHANGE":
        return {
          ...state,
          fetchingProgressStatus: action.payload
        };
      case "USER_INFO_FETCH":
        return {
          ...state,
          userInfo: action.payload
        };
      case "RESET_USER_INFO":
        return {
          ...state,
          userInfo: null
        };
      case "USER_INFO_UPDATE":
        return {
          ...state
        };
      case "USER_DELETE":
        return {
          ...state
        };
      case "ALL_SPORTS_FETCH":
        return {
          ...state,
          allSports: action.payload
        };
      case "FACILITES_FOR_SPORT_FETCH":
        return {
          ...state,
          facilitiesForSport: action.payload
        };
      case "RESET_FETCHED_FACILITIES":
        return {
          ...state,
          facilitiesForSport: []
        };
      case "SLOTS_FOR_FACILITY_FETCH":
        return {
          ...state,
          slotsForFacility: action.payload
        };
      case "RESET_FETCHED_FACILITY_SLOTS":
        return {
          ...state,
          slotsForFacility: []
        };
      case "EQUIPMENT_FOR_SPORT_FETCH":
        return {
          ...state,
          equipmentsForSport: action.payload
        };
      case "RESET_FETCHED_EQUIPMENTS":
        return {
          ...state,
          equipmentsForSport: []
        };
      case "SLOTS_FOR_EQUIPMENT_FETCH":
        return {
          ...state,
          slotsForEquipment: action.payload
        };
      case "RESET_FETCHED_EQUIPMENT_SLOTS":
        return {
          ...state,
          slotsForEquipment: []
        };
      case "ADV_QUERY_1_RESULTS":
        return {
          ...state,
          advQuery1Results: action.payload
        };
      case "ADV_QUERY_2_RESULTS":
        return {
          ...state,
          advQuery2Results: action.payload
        };
        case "EVENT_CREATE":
          return {
            ...state
          };
        case "ADV_TICKETS_SOLD_PER_EVENT":
        return {
          ...state,
          advTicketsSoldPerEvent: action.payload
        };
        case "ADV_BOOKINGS_PER_DAY":
        return {
          ...state,
          advBookingsPerDay: action.payload
        };
        case "ADV_TOTAL_BOOKINGS":
          return {
            ...state,
            advTotalBookings: action.payload
          };
          case "ADV_TOTAL_EVENTS_TICKETS_SOLD":
            return {
              ...state,
              advTotalEventsTicketsSold: action.payload
            };
          case "ADV_TOTAL_REVENUE_EARNED":
            return {
              ...state,
              advTotalRevenue: action.payload
            }
          case "USER_KUNDALI_FETCH":
            return {
              ...state,
              userKundali: action.payload
            }
      default:
        // If this reducer doesn't recognize the action type, or doesn't
        // care about this specific action, return the existing state unchanged
        return state
    }
  }
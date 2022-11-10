const initialState = {
    user: null,
    loggedInUserRole: null,
    netid: null,
    password: null,
    selectedFacility: null,
    selectedSport: null,
    fetchingProgressStatus: false,
    userInfo: null,
    allRoles: { "User": 1,  "Administrator": 2, "Supervisor":3 },
    allSports: [],
    facilitiesForSport: [],
    slotsForFacility: [],
    equipmentsForSport: [],
    slotsForEquipment: []
  }
  
  // Use the initialState as a default value
  export default (state = initialState, action) => {
    // The reducer normally looks at the action type field to decide what happens
    switch (action.type) {
      case "USER_NAME_CHANGE":
        return {
          ...state,
          user: action.payload
        };
      case "SET_USER_ROLE":
        return {
          ...state,
          loggedInUserRole: action.payload
        };
      case "LOGIN_CREDS":
        return {
          ...state,
          netid: action.payload_netid,
          password: action.payload_password
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
        }
      default:
        // If this reducer doesn't recognize the action type, or doesn't
        // care about this specific action, return the existing state unchanged
        return state
    }
  }
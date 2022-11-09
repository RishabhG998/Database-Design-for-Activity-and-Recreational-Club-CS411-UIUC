const initialState = {
    user: null,
    netid: null,
    password: null,
    selectedFacility: null,
    selectedSport: null,
    fetchingProgressStatus: false,
    userInfo: null,
    allRoles: { "User": 1,  "Administrator": 2, "Supervisor":3 }
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
      default:
        // If this reducer doesn't recognize the action type, or doesn't
        // care about this specific action, return the existing state unchanged
        return state
    }
  }
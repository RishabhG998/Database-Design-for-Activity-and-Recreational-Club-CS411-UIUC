const initialState = {
    user: null,
    selectedFacility: null,
    selectedSport: null,
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
      default:
        // If this reducer doesn't recognize the action type, or doesn't
        // care about this specific action, return the existing state unchanged
        return state
    }
  }
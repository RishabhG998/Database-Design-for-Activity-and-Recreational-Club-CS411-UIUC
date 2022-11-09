export function userNameChange(userName) {
    return {
        type: "USER_NAME_CHANGE",
        payload: userName
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


// date: yyyy-mm-dd
// time: yyyy-mm-dd hh:mm:ss
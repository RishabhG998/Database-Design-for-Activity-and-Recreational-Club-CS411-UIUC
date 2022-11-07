export function userNameChange(userName) {
    console.log("In userNameChange: ", userName);
    return {
        type: "USER_NAME_CHANGE",
        payload: userName
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
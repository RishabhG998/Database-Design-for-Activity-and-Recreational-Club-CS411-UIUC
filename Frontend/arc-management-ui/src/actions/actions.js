export function userNameChange(userName) {
    console.log("In userNameChange: ", userName);
    return {
        type: "USER_NAME_CHANGE",
        payload: userName
    }
};
export function getUserRoleFromRoleId(roleId, allRoles){
    Object.keys(allRoles).forEach((roleName) => {
        if(allRoles[roleName] == roleId){
            return roleName;
        }
    });
    return null;
}

export function getRoleNameFromRoleId(roleName, allRoles){
    const roleId = allRoles[roleName];
    return !!roleId ? roleId : null;
}
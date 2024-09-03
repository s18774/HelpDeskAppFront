import { decodeToken } from "react-jwt"

const ROLES = {
    "Guest": 1,
    "User": 2, 
    "Admin": 3, 
    "HelpDesk": 4
}

export const canAddTicketForAnotherUser = (token) => {
    const data = decodeToken(token)
    return data.role === ROLES["Admin"] || data.role === ROLES["HelpDesk"]
}

export const canCreateNewDevice = (token) => {
    const data = decodeToken(token)
    return data.role === ROLES["Admin"]
}

export const canCreateNewGroup = (token) => {
    const data = decodeToken(token)
    return data.role === ROLES["Admin"]
}

export const canCreateUser = (token) => {
    const data = decodeToken(token)
    return data.role === ROLES["Admin"]
}

export const canSeeAllUsers = (token) => {
    const data = decodeToken(token)
    return data.role === ROLES["Admin"]
}

export const canRemoveUserFromGroup = (token) => {
    const data = decodeToken(token)
    return data.role === ROLES["Admin"]
}

export const canAttachHelpdeskUser = (token) => {
    const data = decodeToken(token)
    return data.role === ROLES["Admin"]
}

export const getUserFromToken = (token) => {
    const data = decodeToken(token)
    return data
}

export const getRoleName = (roleId) => {
    const roleNames =  Object.keys(ROLES)
    const rolesIds = Object.values(ROLES)

    for(let i = 0; i < roleNames.length; i++) {
        if(rolesIds[i] === roleId) {
            return roleNames[i]
        } 
    }
    return null
}
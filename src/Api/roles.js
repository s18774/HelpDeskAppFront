import { decodeToken } from "react-jwt"

const ROLES = {
    "Guest": 1,
    "User": 2, 
    "Admin": 3, 
    "HelpDesk": 4
}

export const isAdmin = (data) => {
    return data.role === ROLES["Admin"]
}

export const isHelpdesk = (data) => {
    return data.role === ROLES["HelpDesk"]
}

export const canAddTicketForAnotherUser = (token) => {
    const data = decodeToken(token)
    return isAdmin(data) || isHelpdesk(data)
}

export const canCreateNewDevice = (token) => {
    const data = decodeToken(token)
    return isAdmin(data)
}

export const canCreateNewGroup = (token) => {
    const data = decodeToken(token)
    return isAdmin(data)
}

export const canCreateUser = (token) => {
    const data = decodeToken(token)
    return isAdmin(data)
}

export const canEditUser = (token) => {
    const data = decodeToken(token)
    return isAdmin(data)
}

export const canSeeAllUsers = (token) => {
    const data = decodeToken(token)
    return isAdmin(data) || isHelpdesk(data)
}

export const canRemoveUserFromGroup = (token) => {
    const data = decodeToken(token)
    return isAdmin(data)
}

export const canEditGroup = (token) => {
    const data = decodeToken(token)
    return isAdmin(data)
}

export const canAttachHelpdeskUser = (token) => {
    const data = decodeToken(token)
    return isAdmin(data)
}

export const canAttachDevice = (token) => {
    const data = decodeToken(token)
    return isAdmin(data)
}

export const canAttachGroup = (token) => {
    const data = decodeToken(token)
    return isAdmin(data)
}

export const canEditDevice = (token) => {
    const data = decodeToken(token)
    return isAdmin(data)
}


export const canCreateReport = (token) => {
    const data = decodeToken(token)
    return isAdmin(data) || isHelpdesk(data)
}

export const canSeeLogs = (token) => {
    const data = decodeToken(token)
    return isAdmin(data)
}

export const canSeeGroups = (token) => {
    const data = decodeToken(token)
    return isAdmin(data) || isHelpdesk(data)
}

export const canEditTicket = (token) => {
    const data = decodeToken(token)
    return isAdmin(data) || isHelpdesk(data) 
}

export const canEditApplication = (token) => {
    const data = decodeToken(token)
    return isAdmin(data) || isHelpdesk(data) 
}

export const getUserFromToken = (token) => {
    const data = decodeToken(token)
    return data
}

export const getUserId = (token) => {
    const data = decodeToken(token)
    return data.id
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
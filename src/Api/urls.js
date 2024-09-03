import axios from "axios"
import Ticket from "../components/Ticket/Ticket.component"

const BASE_ADDRESS = "http://localhost:8080/api/v1/"

export const URLS = {
    Auth: BASE_ADDRESS + "auth",
    Tickets: BASE_ADDRESS + "ticket",
    GetTicket: BASE_ADDRESS + "ticket/{ticketId}",
    Applications: BASE_ADDRESS + "application",
    GetApplication: BASE_ADDRESS + "application/{applicationId}",
    AllUsers: BASE_ADDRESS + "user",
    AllUsersDetails: BASE_ADDRESS + "user/details",
    AllSLA: BASE_ADDRESS + "sla",
    AllDepartments: BASE_ADDRESS + "department",
    AllHelpdesk: BASE_ADDRESS + "user/helpdesk",
    AllGroups: BASE_ADDRESS + "group",
    Dashboard: BASE_ADDRESS + "dashboard",
    AllDevices: BASE_ADDRESS + "device",
    AllDeviceTypes: BASE_ADDRESS + "device/types",
    Devices: BASE_ADDRESS + "device",
    Groups: BASE_ADDRESS + "group",
    GetGroup: BASE_ADDRESS + "group/{groupId}",
    GroupUsers: BASE_ADDRESS + "group/{groupId}/users",
    RemoveUserFromGroup: BASE_ADDRESS + "group/{groupId}/users/{userId}",
    AddUserToGroup: BASE_ADDRESS + "group/{groupId}/users/{userId}",
    User: BASE_ADDRESS + "user",
    GetUser: BASE_ADDRESS + "user/{userId}",
    AllRoles: BASE_ADDRESS + "user/roles",
    AllStages: BASE_ADDRESS + "stage",
    CloseTicket: BASE_ADDRESS + "ticket/{ticketId}/close",
    CloseApplication: BASE_ADDRESS + "application/{applicationId}/close"
}

export const parseUrlParams = (params) => {
    const paramsList = Object.keys(params).filter(key => params[key] != null).map(key => `${key}=${params[key]}`)
    if(paramsList.length === 0) {
        return ""
    } else {
        return "?" + paramsList.join("&")
    }
}

export const getList = async (url, token=null) => {
    try {
        const response = await axios.get(url, {
            headers: {
                "Authorization": "Bearer " + token
            }
        })

        if(response.status === 200) {
            return response.data
        }
        else {
            return []
        }
    } catch(error) {
        return []
    }
}

export const getListWithParams = async (url, params, token=null) => {
    const paramsStr = parseUrlParams(params)
    return await getList(url + paramsStr, token)
}
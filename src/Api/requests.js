import axios from "axios"

const sendRequest = async (url, type, data=null, token=null) => {
    const result = {ok: false, data: null, error: null}
    try {
        const options = {
            method: type,
            headers: {
                "Authorization": "Bearer " + token
            },
        }

        if(data != null) {
            options.data = data
        }

        const response = await axios.request(url, options)
    
        if(response.status === 200 || response.status === 201 || response.status === 204) {
            result.ok = true
            result.data = response.data
        }
    } catch(error) {
        result.error = error
    }
    return result
}

export const get = async (url, token=null) => {
    return await sendRequest(url, "get", null, token)
}

export const deleteRequest = async (url, token=null) => {
    return await sendRequest(url, "delete", null, token)
}

export const post = async (url, data, token=null) => {
    return await sendRequest(url, "post", data, token)
}

export const put = async (url, data, token=null) => {
    return await sendRequest(url, "put", data, token)
}


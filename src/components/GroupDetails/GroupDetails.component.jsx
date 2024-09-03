import { Link, useParams } from "react-router-dom"
import { deleteRequest, get, post, put } from "../../api/requests"
import { getList, URLS } from "../../api/urls"
import { useToken } from "../../context/TokenContext"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import CommonTable from "../common/CommonTable.component"
import TableRow from "../common/TableRow.component"
import HiddenElement from "../common/HiddenElement.component"
import { canRemoveUserFromGroup } from "../../api/roles"
import CommonForm from "../common/CommonForm.component"


const GroupDetails = () => {
    const [group, setGroup] = useState(null)
    const [updatedGroup, setUpdatedGroup] = useState(null)
    const [edit, setEdit] = useState(false)
    const [users, setUsers] = useState([])
    const [helpdesks, setHelpdesks] = useState([])
    const [selectedHelpdeskId, setSelectedHelpdeskId] = useState({})

    const onChangeForm = (fieldName, value) => {
        setSelectedHelpdeskId(value)
    }

    const getUsers = async () => {
        setUsers(await getList(URLS.GroupUsers.replace("{groupId}", id), token))
    }

    const getHelpdesk = async () => {
        setHelpdesks(await getList(URLS.AllHelpdesk, token))
    }

    const {id} = useParams()
    const {token} = useToken()

    const getGroup = async () => {
        const {ok, data, error} = await get(URLS.GetGroup.replace("{groupId}", id), token)
        if(ok) {
            setGroup(data)
            setUpdatedGroup(data)
        } else {
            toast.error("Failed to fetch data")
            console.log(error)
        }
    }

    const onChange = (key, value) => {
        console.log("Change: " + value)
        setUpdatedGroup({...updatedGroup, [key]: value})
    }

    const confirmChangeStage = async () => {
        const {ok, data, error} = await put(URLS.Groups, updatedGroup, token)
        if(ok) {
            toast.success("Updated!")
            setEdit(false)
            await getGroup()
        } else {
            console.log(error)
        }
    }

    const toggleEdit = () => {
       setEdit(!edit)
    }

    const addHelpdesk = async () => {
        const {ok, data, error} = await post(URLS.AddUserToGroup.replace("{groupId}", id).replace("{userId}", selectedHelpdeskId), {}, token)
        if(ok) {
            toast.success("Added!")
            await getUsers()
        } else {
            console.log(error)
        }
    }

    useEffect(() => {
        if(edit) {
            setUpdatedGroup(group)
        }
    }, [edit])

    const groupToParams = () => {
        return [
            {name: "Number", value: group.groupId},
            {name: "Name", value: 
                <HiddenElement hidden={!edit} ifHidden={group.groupName}>
                <input value={updatedGroup.groupName} onInput={e => onChange("groupName", e.target.value)}></input>
            </HiddenElement>
            },
            {name: "Active", value:   
                        <HiddenElement hidden={!edit} ifHidden={updatedGroup.isGroupActive === 1 ? "Yes" : "No"}>
                            <select
                                name="isGroupActive"
                                id="isGroupActive"
                                key="isGroupActive"
                                onChange={e => onChange("isGroupActive", e.target.value)}
                                required={true}
                            >
                                <option value={1} selected={updatedGroup.isGroupActive === 1}>Yes</option>
                                <option value={0} selected={updatedGroup.isGroupActive === 0}>No</option>
                            </select>
                            <button onClick={confirmChangeStage}>Save</button>
                        </HiddenElement>           
                    }
        ]
    }

    const removeUserFromGroup = async (userId) => {
        const {ok, data, error} = await deleteRequest(URLS.RemoveUserFromGroup.replace("{groupId}", id).replace("{userId}", userId), token)
        if(ok) {
            toast.success("Removed!")
            await getUsers()
        } else {
            console.log(error)
        }
    }

    useEffect(() => {
        getGroup()
        getUsers()
        getHelpdesk()
    }, [])

    return <div>
        {group && 
        <div>
            <h1>Group details <button onClick={toggleEdit}>Edit</button></h1>
            <CommonTable headers={["Param", "Value"]} hideHeaders={true}>
                {groupToParams().map(p => <TableRow key={p.name} elements={[p.name, p.value]} />)}
            </CommonTable>
            <h2>Helpdesk users</h2>
            <div>
                <CommonForm helpdeskList={helpdesks} onChange={onChangeForm} />
                <button onClick={addHelpdesk}>Add helpdesk</button>
            </div>
            <CommonTable headers={["First Name", "Second Name", "Position", "Action"]}>
            {users.map(user => <TableRow key={user.userId} elements={
                [
                    <Link to={`/user/${user.userId}/details`}>{user.firstName}</Link>, 
                    <Link to={`/user/${user.userId}/details`}>{user.secondName}</Link>, 
                    user.positionName, 
                    canRemoveUserFromGroup(token) ? <button onClick={() => removeUserFromGroup(user.userId)}>Remove</button> : null
                ]} />)}
            </CommonTable>
        </div>}
    </div>
}

export default GroupDetails
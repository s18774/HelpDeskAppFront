import { useContext, useEffect, useState } from "react"
import CommonForm from "../common/CommonForm.component"
import { getList, URLS } from "../../api/urls"
import { canAddTicketForAnotherUser, canAttachHelpdeskUser, canCreateNewDevice, getUserFromToken } from '../../api/roles'
import TokenContext from "../../context/TokenContext"
import toast from "react-hot-toast"
import { post } from "../../api/requests"
import { useNavigate } from "react-router-dom"

const CreateUser = () => {
    const FORM_FIELDS = [
        {id: "firstName", label: "Firstname", type: "text", tag: "input", required: true},
        {id: "secondName", label: "Secondname", type: "text", tag: "input", required: true},
        {id: "positionName", label: "Position", type: "text", tag: "input", required: true},
        {id: "phoneNumber", label: "Phone number", type: "tel", tag: "input", required: true},
        {id: "email", label: "Email", type: "email", tag: "input", required: true},
        {id: "username", label: "Username", type: "text", tag: "input", required: true},
        {id: "floor", label: "Floor", type: "number", tag: "input", required: false},
        {id: "room", label: "Room", type: "number", tag: "input", required: false},
    ]

    const [formData, setFormData] = useState({})
    const [groupsList, setGroupsList] = useState([])
    const [departmentList, setdepartmentList] = useState([])
    const [usersList, setUsersList] = useState([])
    const [rolesList, setRolesList] = useState([])

    const { token } = useContext(TokenContext)
    const navigate = useNavigate()

    const getGroups = async () => {
        setGroupsList(await getList(URLS.AllGroups, token))
    }

    const getUsers = async () => {
        setUsersList(await getList(URLS.AllUsers, token))
    }

    const getRoles = async () => {
        setRolesList(await getList(URLS.AllRoles, token))
    }

    const getDepartments = async () => {
        const departments = await getList(URLS.AllDepartments, token)
        departments.forEach(department => {
            department.name = `${department.building} (${department.departmentName})`
        })
        setdepartmentList(departments)
    }

    useEffect(() => {
        getGroups()
        getDepartments()
        getUsers()
        getRoles()
    }, [])

    const onChangeForm = (fieldName, value) => {
        const newFormData = { ...formData, [fieldName]: value }
        console.log(newFormData)
        setFormData(newFormData)
    }

    const onAddUser = async () => {
        if (Object.keys(formData).length === 0) {
            toast.error("Fill the form first!")
        } else {
            const { ok, error } = await post(URLS.User, formData, token)
            if (ok) {
                toast.success("Added")
                onBackToUserList()
            } else {
                console.log(error)
                toast.error("Failed to create user")
            }
        }
    }

    const onBackToUserList = () => {
        navigate("/user")
    }

    return (
        canCreateNewDevice(token) &&
        <div>
            <h1>New user</h1>
            <button onClick={onAddUser}>Save</button>
            <button onClick={onBackToUserList}>Back</button>
            <CommonForm
                onChange={onChangeForm}
                fields={FORM_FIELDS}
                groupList={groupsList} 
                departmentList={departmentList}
                usersList={usersList}
                rolesList={rolesList}
                passwordField={true}/>
        </div>

    )
}

export default CreateUser
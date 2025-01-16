import { useContext, useEffect, useState } from "react"
import CommonForm from "../common/CommonForm.component"
import { getList, URLS } from "../../api/urls"
import { canAddTicketForAnotherUser, canAttachHelpdeskUser, getUserFromToken } from '../../api/roles'
import TokenContext from "../../context/TokenContext"
import toast from "react-hot-toast"
import { post } from "../../api/requests"
import { useNavigate } from "react-router-dom"

const CreateTicket = () => {
    const FORM_FIELDS = [
        { id: "floor", label: "Floor", type: "number", tag: "input", required: true },
        { id: "title", label: "Title", type: "text", tag: "input", required: true },
        { id: "description", label: "Description", type: "text", tag: "textarea", required: false }
    ]

    const [usersList, setUsersList] = useState([])
    const [slaList, setSlaList] = useState([])
    const [departmentList, setdepartmentList] = useState([])
    const [formData, setFormData] = useState({})
    const [helpdeskList, setHelpdeskList] = useState([])
    const [groupList, setGroupList] = useState([])

    const { token } = useContext(TokenContext)
    const navigate = useNavigate()

    const getUsers = async () => {
        setUsersList(await getList(URLS.AllUsers, token))
    }

    const getSLA = async () => {
        setSlaList(await getList(URLS.AllSLA, token))
    }

    const getHelpdesk = async () => {
        setHelpdeskList(await getList(URLS.AllHelpdesk, token))
    }

    const getGroups = async () => {
        setGroupList(await getList(URLS.AllGroups, token))
    }


    const getDepartments = async () => {
        const departments = await getList(URLS.AllDepartments, token)
        departments.forEach(department => {
            department.name = `${department.building} (${department.departmentName})`
        })
        setdepartmentList(departments)
    }

    const onChangeForm = (fieldName, value) => {
        console.log(fieldName, value)
        const newFormData = { ...formData, [fieldName]: value }
        console.log(newFormData)
        setFormData(newFormData)
    }

    useEffect(() => {
        getDepartments()
        if (canAddTicketForAnotherUser(token)) {
            getUsers()
            getSLA()
        } else {
            const user = getUserFromToken(token)
            setUsersList([
                { fullName: user.fullName, userId: user.id }
            ])
        }

        if (canAttachHelpdeskUser(token)) {
            getHelpdesk()
            getGroups()
        }
    }, [])

    const onAddTicket = async () => {
        if (Object.keys(formData).length === 0) {
            toast.error("Fill the form first!")
        } else {
            const { ok, error } = await post(URLS.Tickets, formData, token)
            if (ok) {
                toast.success("Added")
                onBackToTicketList()
            } else {
                console.log(error)
                toast.error("Failed to create ticket")
            }
        }
    }

    const onBackToTicketList = () => {
        navigate("/ticket")
    }

    return (
        <div>
            <h1 className="text-center m-2 mb-3">New ticket</h1>

            <div className="d-flex flex-column justify-content-center align-items-center">
                <CommonForm
                    usersList={usersList}
                    slaList={slaList}
                    departmentList={departmentList}
                    helpdeskList={helpdeskList}
                    groupList={groupList}
                    onChange={onChangeForm}
                    fields={FORM_FIELDS} />
                <div>
                    <button className="btn btn-primary m-1" onClick={onAddTicket}>Save</button>
                    <button className="btn btn-primary m-1" onClick={onBackToTicketList}>Back</button>
                </div>
            </div>

        </div>

    )
}

export default CreateTicket
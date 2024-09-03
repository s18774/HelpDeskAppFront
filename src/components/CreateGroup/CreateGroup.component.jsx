import { useContext, useEffect, useState } from "react"
import CommonForm from "../common/CommonForm.component"
import { getList, URLS } from "../../api/urls"
import { canAddTicketForAnotherUser, canAttachHelpdeskUser, canCreateNewGroup, getUserFromToken } from '../../api/roles'
import TokenContext from "../../context/TokenContext"
import toast from "react-hot-toast"
import { post } from "../../api/requests"
import { useNavigate } from "react-router-dom"

const CreateGroup = () => {
    const FORM_FIELDS = [
        {id: "groupName", label: "Group Name", type: "text", tag: "input", required: true}
    ]

    const [formData, setFormData] = useState({})

    const { token } = useContext(TokenContext)
    const navigate = useNavigate()


    const onChangeForm = (fieldName, value) => {
        console.log(fieldName, value)
        const newFormData = { ...formData, [fieldName]: value }
        console.log(newFormData)
        setFormData(newFormData)
    }

    const onAddGroup = async () => {
        if (Object.keys(formData).length === 0) {
            toast.error("Fill the form first!")
        } else {
            const { ok, error } = await post(URLS.Groups, formData, token)
            if (ok) {
                toast.success("Added")
                onBackToDeviceList()
            } else {
                console.log(error)
                toast.error("Failed to create device")
            }
        }
    }

    const onBackToDeviceList = () => {
        navigate("/group")
    }

    return (
        canCreateNewGroup(token) &&
        <div>
            <h1>New group</h1>
            <button onClick={onAddGroup}>Save</button>
            <button onClick={onBackToDeviceList}>Back</button>
            <CommonForm
                onChange={onChangeForm}
                fields={FORM_FIELDS} />
        </div>

    )
}

export default CreateGroup
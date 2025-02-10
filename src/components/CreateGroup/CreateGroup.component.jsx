import { useContext, useState } from "react"
import CommonForm from "../common/CommonForm.component"
import { getList, URLS } from "../../api/urls"
import { canCreateNewGroup } from '../../api/roles'
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

    const allRequiredFieldsAreFilled = () => {
        if(Object.keys(formData).length === 0) {
            return false;
        }

        for(let i = 0; i < FORM_FIELDS.length; i++) {
            if(formData[FORM_FIELDS[i].id] == undefined || formData[FORM_FIELDS[i].id] == null || formData[FORM_FIELDS[i].id] === "") {
                return false;
            }
        }
        return true
    }

    const onAddGroup = async () => {
        if (!allRequiredFieldsAreFilled()) {
            toast.error("Fill the form first!")
        } else {
            const { ok, error } = await post(URLS.Groups, formData, token)
            if (ok) {
                toast.success("Added")
                onBackToDeviceList()
            } else {
                console.log(error)
                toast.error("Failed to create group")
            }
        }
    }

    const onBackToDeviceList = () => {
        navigate("/group")
    }

    return (
        canCreateNewGroup(token) &&
        <div>
            <h1 className="text-center m-2 mb-3">New group</h1>

            <div className="d-flex flex-column justify-content-center align-items-center">


            <CommonForm
                onChange={onChangeForm}
                fields={FORM_FIELDS} />

                <div>
                <button className="btn btn-primary m-1" onClick={onAddGroup}>Save</button>
                <button className="btn btn-primary m-1" onClick={onBackToDeviceList}>Back</button>
                </div>
                    </div>
        </div>

    )
}

export default CreateGroup
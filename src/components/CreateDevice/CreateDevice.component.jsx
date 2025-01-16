import { useContext, useEffect, useState } from "react"
import CommonForm from "../common/CommonForm.component"
import { getList, URLS } from "../../api/urls"
import { canCreateNewDevice } from '../../api/roles'
import TokenContext from "../../context/TokenContext"
import toast from "react-hot-toast"
import { post } from "../../api/requests"
import { useNavigate } from "react-router-dom"

const CreateDevice = () => {
    const FORM_FIELDS = [
        { id: "brand", label: "Brand", type: "text", tag: "input", required: true },
        { id: "model", label: "Model", type: "text", tag: "input", required: true },
        { id: "serialNumber", label: "Serial number", type: "text", tag: "input", required: true },
        { id: "inventoryNumber", label: "Inventory number", type: "text", tag: "input", required: true },
        { id: "macAddress", label: "MAC Address", type: "text", tag: "input", required: false },
        { id: "guarantee", label: "Guarantee", type: "checkbox", tag: "input" },
    ]

    const [formData, setFormData] = useState({})
    const [deviceTypesList, setDeviceTypeList] = useState([])

    const { token } = useContext(TokenContext)
    const navigate = useNavigate()

    const getDeviceTypes = async () => {
        setDeviceTypeList(await getList(URLS.AllDeviceTypes, token))
    }

    useEffect(() => {
        getDeviceTypes()
    }, [])

    useEffect(() => {
        console.log(deviceTypesList)
    }, [deviceTypesList])

    const onChangeForm = (fieldName, value) => {
        console.log(fieldName, value)
        const newFormData = { ...formData, [fieldName]: value }
        console.log(newFormData)
        setFormData(newFormData)
    }

    const onAddDevice = async () => {
        if (Object.keys(formData).length === 0) {
            toast.error("Fill the form first!")
        } else {
            const { ok, error } = await post(URLS.Devices, formData, token)
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
        navigate("/device")
    }

    return (
        canCreateNewDevice(token) &&
        <div>
            <h1 className="text-center m-2 mb-3">New device</h1>

            <div className="d-flex flex-column justify-content-center align-items-center">

                <CommonForm
                    deviceTypes={deviceTypesList}
                    onChange={onChangeForm}
                    fields={FORM_FIELDS} />
                <div>
                    <button className="btn btn-primary m-1" onClick={onAddDevice}>Save</button>
                    <button className="btn btn-primary m-1" onClick={onBackToDeviceList}>Back</button>
                </div>
            </div>


        </div>

    )
}

export default CreateDevice
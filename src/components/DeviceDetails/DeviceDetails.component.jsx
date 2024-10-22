import { Link, useParams } from "react-router-dom"
import { get, post, put } from "../../api/requests"
import { URLS, getList } from "../../api/urls"
import { useToken } from "../../context/TokenContext"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import CommonTable from "../common/CommonTable.component"
import TableRow from "../common/TableRow.component"
import Select from "../common/Select.component"
import HiddenElement from "../common/HiddenElement.component"
import Modal from 'react-modal';

const modalStyle = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };


const DeviceDetails = () => {
    const [device, setDevice] = useState(null)
    const [updatedDevice, setUpdatedDevice] = useState(null)
    const [usersList, setUsersList] = useState([])
    const [edit, setEdit] = useState(false)
    const [modalIsOpen, setModalIsOpen] = useState(false)

    const {id} = useParams()
    const {token} = useToken()

    const getDevice = async () => {
        const {ok, data, error} = await get(URLS.GetDevice.replace("{deviceId}", id), token)
        if(ok) {
            data.slaId = data.sla
            setDevice(data)
            setUpdatedDevice(data)
        } else {
            toast.error("Failed to fetch data")
            console.log(error)
        }
    }

    const confirmChangeDevice = async () => {
        const {ok, data, error} = await put(URLS.Devices, updatedDevice, token)
        if(ok) {
            toast.success("Updated!")
            setEdit(false)
            await getDevice()
        } else {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    const getUsers = async () => {
        setUsersList(await getList(URLS.AllUsers, token))
    }

    const onChange = (key, value) => {
        setUpdatedDevice({...updatedDevice, [key]: value})
    }

    const toggleEdit = () => {
       setEdit(!edit)
    }

    useEffect(() => {
        if(edit) {
            setUpdatedDevice(device)
        }
    }, [edit])

    const showUsers = () => {
        const user = usersList.find(s => s.userId===device.userId)
        return user ? <Link to={`/user/${device.userId}/details`}>{user.fullName}</Link> : ""
    }

    const deviceToParams = () => {
        return [
            {name: "Number", value: device.deviceId},
            {name: "Device Type", value: device.deviceTypeName},
            {name: "Brand", value: device.brand},
            {name: "Model", value: device.model},
            {name: "Serial Number", value: device.serialNumber},
            {name: "Date Of Purchase", value: device.dateOfPurchase},
            {name: "MAC Address", value: device.macAddress},
            {name: "IP Address", value: 
                <HiddenElement hidden={!edit} ifHidden={device.ipAddress}>
                    <input value={updatedDevice.ipAddress} onInput={e => onChange("ipAddress", e.target.value)}></input>
                </HiddenElement>
            },
            {name: "Inventory Number", value: 
                <HiddenElement hidden={!edit} ifHidden={device.inventoryNumber}>
                    <input value={updatedDevice.inventoryNumber} onInput={e => onChange("inventoryNumber", e.target.value)}></input>
                </HiddenElement>
            },
            {name: "Guarantee", value: 
                <HiddenElement hidden={!edit} ifHidden={device.isGuarantee === 1 ? "Yes" : "No"}>
                    <input type="checkbox" checked={updatedDevice.isGuarantee === 1} onChange={e => onChange("isGuarantee", updatedDevice.isGuarantee == 1 ? 0 : 1)}></input>
                </HiddenElement>
            },
            {name: "User", value:   
                <HiddenElement hidden={!edit} ifHidden={showUsers()}>
                    <Select
                        keyName="userId"
                        valueName="fullName"
                        objects={usersList}
                        name="userId"
                        id="userId"
                        key="user"
                        onSelect={e => onChange("userId", e.target.value)}
                        required={false}
                        selectedValue={updatedDevice.userId}
                        emptyOptionEnabled={true}
                    />
                </HiddenElement>           
            }
        ]
    }

    useEffect(() => {
        getDevice()
        getUsers()
    }, [])

    return <div>
        {device && 
        <div>
            <h1>Device details    <button onClick={toggleEdit}>Edit</button></h1>
            <CommonTable headers={["Param", "Value"]} hideHeaders={true}>
                {deviceToParams().map(p => <TableRow key={p.name} elements={[p.name, p.value]} />)}
            </CommonTable>

            <HiddenElement hidden={!edit} ifHidden={() => ""}>
                            <button onClick={confirmChangeDevice}>Save</button>
            </HiddenElement>   
        </div>}
    </div>
}

export default DeviceDetails
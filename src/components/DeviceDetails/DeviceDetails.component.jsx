import { useParams } from "react-router-dom"
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

    const getUsers = async () => {
        setUsersList(await getList(URLS.AllUsers, token))
    }

    const onChange = (key, value) => {
        setUpdatedDevice({...updatedDevice, [key]: value})
    }

    const confirmChangeStage = async () => {
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

    const toggleEdit = () => {
       setEdit(!edit)
    }

    useEffect(() => {
        if(edit) {
            setUpdatedDevice(device)
        }
    }, [edit])

    const showHelpdesk = () => {
        const helpdesk = usersList.find(s => s.userId===device.helpdeskId)
        return helpdesk ? helpdesk.fullName : ""
    }

    const ticketToParams = () => {
        return [
            {name: "Number", value: device.ticketId},
            {name: "Opening date", value: device.openingDate},
            {name: "Title", value: 
                <HiddenElement hidden={!edit} ifHidden={device.title}>
                    <input value={updatedDevice.title} onInput={e => onChange("title", e.target.value)}></input>
                </HiddenElement>
            },
            {name: "Description", value: 
                <HiddenElement hidden={!edit} ifHidden={device.description}>
                    <input value={updatedDevice.description} onInput={e => onChange("description", e.target.value)}></input>
                </HiddenElement>
            },
            {name: "User", value: device.fullName
            },
            {name: "Helpdesk", value:   
                <HiddenElement hidden={!edit} ifHidden={showHelpdesk()}>
                    <Select
                        keyName="userId"
                        valueName="fullName"
                        objects={usersList}
                        name="userId"
                        id="userId"
                        key="user"
                        onSelect={e => onChange("helpdeskId", e.target.value)}
                        required={false}
                        selectedValue={updatedDevice.helpdeskId}
                        emptyOptionEnabled={true}
                    />
                </HiddenElement>           
            }
        ]
    }

    const closeTicket = async () => {
        setModalIsOpen(true)
    }

    const closeModal = () => {
        setModalIsOpen(false)
    }

    const onSubmitCloseTicket = async () => {
        const {ok, data, error} = await post(URLS.CloseTicket.replace("{ticketId}", id), {}, token)
        if(ok) {
            toast.success("Success")
            getDevice()
            closeModal()
        } else {
            toast.error("Failed to close ticket")
        }
    }

    useEffect(() => {
        getDevice()
        getUsers()
    }, [])

    return <div>
        {device && 
        <div>
            <h1>Device details</h1>
            <CommonTable headers={["Param", "Value"]} hideHeaders={true}>
                {ticketToParams().map(p => <TableRow key={p.name} elements={[p.name, p.value]} />)}
            </CommonTable>
        </div>}

        <Modal isOpen={modalIsOpen} style={modalStyle}>
            Are you sure??
            <div>
            <button onClick={onSubmitCloseTicket}>Yes</button>
            <button onClick={closeModal}>No</button>
            </div>
        </Modal>    
    </div>
}

export default DeviceDetails
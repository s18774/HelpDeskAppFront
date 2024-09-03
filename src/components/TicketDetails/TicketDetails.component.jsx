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


const TicketDetails = () => {
    const [ticket, setTicket] = useState(null)
    const [updatedTicket, setUpdatedTicket] = useState(null)
    const [stages, setStages] = useState([])
    const [slaList, setSlaList] = useState([])
    const [helpdeskList, setHelpdeskList] = useState([])
    const [edit, setEdit] = useState(false)
    const [modalIsOpen, setModalIsOpen] = useState(false)

    const {id} = useParams()
    const {token} = useToken()

    const getTicket = async () => {
        const {ok, data, error} = await get(URLS.GetTicket.replace("{ticketId}", id), token)
        if(ok) {
            data.slaId = data.sla
            setTicket(data)
            setUpdatedTicket(data)
        } else {
            toast.error("Failed to fetch data")
            console.log(error)
        }
    }

    const getStages = async () => {
        await setStages(await getList(URLS.AllStages, token))
    }

    const getSLA = async () => {
        setSlaList(await getList(URLS.AllSLA, token))
    }

    const getHelpdesk = async () => {
        setHelpdeskList(await getList(URLS.AllHelpdesk, token))
    }

    const onChange = (key, value) => {
        setUpdatedTicket({...updatedTicket, [key]: value})
    }

    const confirmChangeStage = async () => {
        const {ok, data, error} = await put(URLS.Tickets, updatedTicket, token)
        if(ok) {
            toast.success("Updated!")
            setEdit(false)
            await getTicket()
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
            setUpdatedTicket(ticket)
        }
    }, [edit])

    const showStage = () => {
        console.log(ticket.stageId)
        const stage = stages.find(s => s.stageId===ticket.stageId)
        if(stage) {
            return stage.stageName
        } else {
            return ""
        }
    }

    const showHelpdesk = () => {
        const helpdesk = helpdeskList.find(s => s.userId===ticket.helpdeskId)
        return helpdesk ? helpdesk.fullName : ""
    }

    const ticketToParams = () => {
        return [
            {name: "Number", value: ticket.ticketId},
            {name: "SLA", value: 
                <HiddenElement hidden={!edit} ifHidden={ticket.sla}>
                    <Select keyName="slaId" emptyOptionEnabled={false} valueName="slaLevel" selectedValue={updatedTicket.sla} objects={slaList} name="slaId" key="sla" onSelect={e => onChange("slaId", e.target.value)} required={true} />
                </HiddenElement>
            },
            {name: "Opening date", value: ticket.openingDate},
            {name: "Title", value: 
                <HiddenElement hidden={!edit} ifHidden={ticket.title}>
                    <input value={updatedTicket.title} onInput={e => onChange("title", e.target.value)}></input>
                </HiddenElement>
            },
            {name: "Description", value: 
                <HiddenElement hidden={!edit} ifHidden={ticket.description}>
                    <input value={updatedTicket.description} onInput={e => onChange("description", e.target.value)}></input>
                </HiddenElement>
            },
            {name: "User", value: ticket.fullName
            },
            {name: "Helpdesk", value:   
                <HiddenElement hidden={!edit} ifHidden={showHelpdesk()}>
                    <Select
                        keyName="userId"
                        valueName="fullName"
                        objects={helpdeskList}
                        name="userId"
                        id="userId"
                        key="user"
                        onSelect={e => onChange("helpdeskId", e.target.value)}
                        required={false}
                        selectedValue={updatedTicket.helpdeskId}
                        emptyOptionEnabled={true}
                    />
                </HiddenElement>           
            },
            {name: "Status", value:   
                        <HiddenElement hidden={!edit} ifHidden={showStage()}>
                            <Select
                                keyName="stageId"
                                valueName="stageName"
                                objects={stages}
                                name="stageId"
                                id="stageId"
                                key="stageName"
                                onSelect={e => onChange("stageId", e.target.value)}
                                required={true}
                                selectedValue={updatedTicket.stageId}
                                emptyOptionEnabled={false}
                            />
                            <button onClick={confirmChangeStage}>Save</button>
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
            getTicket()
            closeModal()
        } else {
            toast.error("Failed to close ticket")
        }
    }

    useEffect(() => {
        getTicket()
        getStages()
        getSLA()
        getHelpdesk()
    }, [])

    return <div>
        {ticket && 
        <div>
            <h1>Ticket details {showStage() === "Closed" ? <span>(closed)</span> : <button onClick={toggleEdit}>Edit</button>}</h1>
            <CommonTable headers={["Param", "Value"]} hideHeaders={true}>
                {ticketToParams().map(p => <TableRow key={p.name} elements={[p.name, p.value]} />)}
            </CommonTable>
            {showStage() !== "Closed" && <button onClick={closeTicket}>Close ticket</button>}
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

export default TicketDetails
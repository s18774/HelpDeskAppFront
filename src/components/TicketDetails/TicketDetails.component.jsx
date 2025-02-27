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
import { canAttachGroup, canAttachHelpdeskUser, canEditTicket, canSeeGroups } from "../../api/roles"

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
    const [groupList, setGroupList] = useState([])
    const [edit, setEdit] = useState(false)
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [editStatus, setEditStatus] = useState(false)

    const { id } = useParams()
    const { token } = useToken()

    const getTicket = async () => {
        const { ok, data, error } = await get(URLS.GetTicket.replace("{ticketId}", id), token)
        if (ok) {
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

    const getGroups = async () => {
        setGroupList(await getList(URLS.AllGroups, token))
    }

    const onChange = (key, value) => {
        setUpdatedTicket({ ...updatedTicket, [key]: value })
    }

    const confirmChangeStage = async () => {
        const { ok, data, error } = await put(URLS.Tickets, updatedTicket, token)
        if (ok) {
            toast.success("Updated!")
            setEdit(false)
            setEditStatus(false)
            await getTicket()
        } else {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    const toggleEdit = () => {
        setEdit(!edit)
    }

    const toggleEditStatus = () => {
        if (edit) {
            return
        }
        setEditStatus(!editStatus)
    }

    useEffect(() => {
        if (edit) {
            setUpdatedTicket(ticket)
        }
    }, [edit])

    const showStage = () => {
        console.log(ticket.stageId)
        const stage = stages.find(s => s.stageId === ticket.stageId)
        if (stage) {
            return stage.stageName
        } else {
            return ""
        }
    }

    const showGroup = () => {
        const group = groupList.find(s => s.groupId === ticket.groupId)
        if(canSeeGroups(token)) {
            return group ? <Link to={`/group/${ticket.groupId}/details`}>{group.groupName}</Link> : ""
        } else {
             return group ? group.groupName : ""
        }

    }

    const showHelpdesk = () => {
        const helpdesk = helpdeskList.find(s => s.userId === ticket.helpdeskId)
        return helpdesk ? <Link to={`/user/${ticket.helpdeskId}/details`}>{helpdesk.fullName}</Link> : ""
    }

    const ticketToParams = () => {
        return [
            { name: "Number", value: ticket.tickerNumber },
            {
                name: "SLA", value:
                    <HiddenElement hidden={!edit} ifHidden={ticket.sla}>
                        <Select keyName="slaId" emptyOptionEnabled={false} valueName="slaLevel" selectedValue={updatedTicket.sla} objects={slaList} name="slaId" key="sla" onSelect={e => onChange("slaId", e.target.value)} required={true} />
                    </HiddenElement>
            },
            { name: "Opening date", value: ticket.openingDate },
            { name: "Closing date", value: ticket.closingDate },
            { name: "Closed by", value: ticket.resolverUser },
            {
                name: "Title", value:
                    <HiddenElement hidden={!edit} ifHidden={ticket.title}>
                        <input className="form-control" value={updatedTicket.title} onInput={e => onChange("title", e.target.value)}></input>
                    </HiddenElement>
            },
            {
                name: "Description", value:
                    <HiddenElement hidden={!edit} ifHidden={ticket.description}>
                        <input className="form-control" value={updatedTicket.description} onInput={e => onChange("description", e.target.value)}></input>
                    </HiddenElement>
            },
            {
                name: "Room Number", value:
                    <HiddenElement hidden={!edit} ifHidden={ticket.roomNumber}>
                        <input className="form-control" value={updatedTicket.roomNumber} onInput={e => onChange("roomNumber", e.target.value)}></input>
                    </HiddenElement>
            },
            {
                name: "Floor", value:
                    <HiddenElement hidden={!edit} ifHidden={ticket.floor}>
                        <input className="form-control" value={updatedTicket.floor} onInput={e => onChange("floor", e.target.value)}></input>
                    </HiddenElement>
            },
            {
                name: "User", value: <Link to={`/user/${ticket.userId}/details`}>{ticket.fullName}</Link>,
            },
            {
                name: "Helpdesk", value:
                    <HiddenElement hidden={!edit || !canAttachHelpdeskUser(token)} ifHidden={showHelpdesk()}>
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
            {
                name: "Group", value:
                    <HiddenElement hidden={!edit || !canAttachGroup(token)} ifHidden={showGroup()}>
                        <Select
                            keyName="groupId"
                            valueName="groupName"
                            objects={groupList}
                            name="groupId"
                            id="groupId"
                            key="group"
                            onSelect={e => onChange("groupId", e.target.value)}
                            required={true}
                            selectedValue={updatedTicket.groupId}
                            emptyOptionEnabled={true}
                        />
                    </HiddenElement>
            },
            {
                name: "Status", value:
                    <HiddenElement hidden={!editStatus} ifHidden={showStage()}>
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
        const { ok, data, error } = await post(URLS.CloseTicket.replace("{ticketId}", id), {}, token)
        if (ok) {
            toast.success("Success")
            getTicket()
            closeModal()
            setEdit(false)
            setEditStatus(false)
        } else {
            toast.error("Failed to close ticket")
        }
    }

    useEffect(() => {
        getTicket()
        getStages()
        getSLA()
        getHelpdesk()
        getGroups()
    }, [])

    return <div>
        {ticket &&
            <div>
                <h1>Ticket details {showStage() === "Closed" ? <span>(closed)</span> :

                    canEditTicket(token) &&
                    <span>
                        <button className="btn btn-primary m-1" onClick={toggleEdit}>Edit</button>
                        {showStage() !== "Closed" && <button className="btn btn-primary m-1" onClick={toggleEditStatus}>Change Status</button>}
                        {showStage() !== "Closed" && <button className="btn btn-primary m-1" onClick={closeTicket}>Close ticket</button>}
                    </span>

                }</h1>
                <CommonTable headers={["Param", "Value"]} hideHeaders={true}>
                    {ticketToParams().map(p => <TableRow key={p.name} elements={[p.name, p.value]} />)}
                </CommonTable>

                <HiddenElement hidden={!edit && !editStatus} ifHidden={() => ""}>
                    <button className="btn btn-primary m-2" onClick={confirmChangeStage}>Save</button>
                </HiddenElement>

            </div>}

        <Modal isOpen={modalIsOpen} style={modalStyle}>
            Are you sure??
            <div className="d-flex gap-1">
                <button className="btn btn-primary" onClick={onSubmitCloseTicket}>Yes</button>
                <button className="btn btn-primary" onClick={closeModal}>No</button>
            </div>
        </Modal>
    </div>
}

export default TicketDetails
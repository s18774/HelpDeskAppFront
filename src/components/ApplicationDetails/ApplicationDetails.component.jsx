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
import Modal from 'react-modal'
import { canAttachGroup, canAttachHelpdeskUser, canEditApplication, canSeeGroups } from "../../api/roles"


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


const ApplicationDetails = () => {
    const [application, setApplication] = useState(null)
    const [updatedApplication, setUpdatedApplication] = useState(null)

    const [stages, setStages] = useState([])
    const [slaList, setSlaList] = useState([])
    const [helpdeskList, setHelpdeskList] = useState([])
    const [groupList, setGroupList] = useState([])
    const [edit, setEdit] = useState(false)
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [editStatus, setEditStatus] = useState(false)

    const { id } = useParams()
    const { token } = useToken()

    const getApplication = async () => {
        const { ok, data, error } = await get(URLS.GetApplication.replace("{applicationId}", id), token)
        if (ok) {
            data.slaId = data.sla
            setApplication(data)
            setUpdatedApplication(data)
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

    const onChange = (key, value) => {
        setUpdatedApplication({ ...updatedApplication, [key]: value })
    }

    const getHelpdesk = async () => {
        setHelpdeskList(await getList(URLS.AllHelpdesk, token))
    }

    const getGroups = async () => {
        setGroupList(await getList(URLS.AllGroups, token))
    }

    const confirmChangeStage = async () => {
        const { ok, data, error } = await put(URLS.Applications, updatedApplication, token)
        if (ok) {
            toast.success("Updated!")
            setEdit(false)
            setEditStatus(false)
            await getApplication()
        } else {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    const toggleEdit = () => {
        setEdit(!edit)
    }

    useEffect(() => {
        if (edit) {
            setUpdatedApplication(application)
        }
    }, [edit])

    const showStage = () => {
        const stage = stages.find(s => s.stageId === application.stageId)
        return stage ? stage.stageName : ""
    }

    const showHelpdesk = () => {
        const helpdesk = helpdeskList.find(s => s.userId === application.helpdeskId)
        return helpdesk ? <Link to={`/user/${application.helpdeskId}/details`}>{helpdesk.fullName}</Link> : ""
    }

    const showGroup = () => {
        const group = groupList.find(s => s.groupId === application.groupId)
        if(canSeeGroups(token)) {
             return group ? <Link to={`/group/${application.groupId}/details`}>{group.groupName}</Link> : ""
        }
        else {
            return group ? group.groupName : ""
        }
    }

    const applicationToParams = () => {
        return [
            { name: "Number", value: application.applicationNumber },
            { name: "Type", value: application.typeOfApplication },
            {
                name: "SLA", value:
                    <HiddenElement hidden={!edit} ifHidden={application.sla}>
                        <Select keyName="slaId" emptyOptionEnabled={false} valueName="slaLevel" selectedValue={updatedApplication.sla} objects={slaList} name="slaId" key="sla" onSelect={e => onChange("slaId", e.target.value)} required={true} />
                    </HiddenElement>
            },
            { name: "Opening date", value: application.openingDate },
            { name: "Closing date", value: application.closingDate },
            { name: "Closed by", value: application.resolverUser },
            {
                name: "Subject", value:
                    <HiddenElement hidden={!edit} ifHidden={application.subject}>
                        <input className="form-control" value={updatedApplication.subject} onInput={e => onChange("subject", e.target.value)}></input>
                    </HiddenElement>
            },
            {
                name: "Description", value:
                    <HiddenElement hidden={!edit} ifHidden={application.description}>
                        <input className="form-control" value={updatedApplication.description} onInput={e => onChange("description", e.target.value)}></input>
                    </HiddenElement>
            },
            {
                name: "User", value: <Link to={`/user/${application.userId}/details`}>{application.fullName}</Link>
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
                            selectedValue={updatedApplication.helpdeskId}
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
                            selectedValue={updatedApplication.groupId}
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
                            selectedValue={updatedApplication.stageId}
                            emptyOptionEnabled={false}
                        />
                    </HiddenElement>
            },
        ]
    }

    useEffect(() => {
        getApplication()
        getStages()
        getSLA()
        getGroups()
        getHelpdesk()
    }, [])

    const closeApplication = async () => {
        setModalIsOpen(true)
    }

    const closeModal = () => {
        setModalIsOpen(false)
    }

    const toggleEditStatus = () => {
        if (edit) {
            return
        }
        setEditStatus(!editStatus)
    }

    const onSubmitCloseApplication = async () => {
        const { ok, data, error } = await post(URLS.CloseApplication.replace("{applicationId}", id), {}, token)
        if (ok) {
            toast.success("Success")
            setEdit(false)
            setEditStatus(false)
            getApplication()
            closeModal()
        } else {
            toast.error("Failed to close application")
        }
    }

    return <div>
        {application &&
            <div>
                <h1>Application details  {showStage() === "Closed" ? <span>(closed)</span> :
                    canEditApplication(token) &&
                    <span>

                        <button onClick={toggleEdit} class="btn btn-primary m-1">Edit</button>
                        {showStage() !== "Closed" && <button class="btn btn-primary m-1" onClick={toggleEditStatus}>Change Status</button>}
                        {showStage() !== "Closed" && <button class="btn btn-primary m-1" onClick={closeApplication}>Close application</button>}
                    </span>
                }</h1>
                <CommonTable headers={["Param", "Value"]} hideHeaders={true}>
                    {applicationToParams().map(p => <TableRow key={p.name} elements={[p.name, p.value]} />)}
                </CommonTable>

                <HiddenElement hidden={!edit && !editStatus} ifHidden={() => ""}>
                    <button 	class="btn btn-primary m-2" onClick={confirmChangeStage}>Save</button>
                </HiddenElement>
            </div>}

        <Modal isOpen={modalIsOpen} style={modalStyle}>
            Are you sure??
            <div>
                <button onClick={onSubmitCloseApplication}>Yes</button>
                <button onClick={closeModal}>No</button>
            </div>
        </Modal>
    </div>
}

export default ApplicationDetails
import { Link, useParams } from "react-router-dom"
import { get, post, put } from "../../api/requests"
import { URLS, getList, getListWithParams } from "../../api/urls"
import { useToken } from "../../context/TokenContext"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import CommonTable from "../common/CommonTable.component"
import TableRow from "../common/TableRow.component"
import Select from "../common/Select.component"
import HiddenElement from "../common/HiddenElement.component"
import CommonForm from "../common/CommonForm.component"


const TEXT_FIELDS = [
    {label: "Firstname", name: "firstName"},
    {label: "Secondname Name", name: "secondName"},
    {label: "Position", name: "positionName"},
    {label: "Email", name: "email"},
    {label: "Phone number", name: "phoneNumber"},
    {label: "Username", name: "username"},
    {label: "Floor", name: "floor"},
    {label: "Room", name: "room"},
]


const UserDetails = () => {
    const [user, setUser] = useState(null)
    const [updatedUser, setUpdatedUser] = useState(null)
    const [groups, setGroups] = useState([])
    const [departments, setDepartments] = useState([])
    const [users, setUsers] = useState([])
    const [roles, setRoles] = useState([])
    const [edit, setEdit] = useState(false)
    const [expLvlList, setExpLvlList] = useState([])
    const [dashboard, setDashboard] = useState([])
    const [stages, setStages] = useState([])
    const [devices, setDevices] = useState([])
    const [notAttachedDevices, setNotAttachedDevices] = useState([])
    const [selectedDevice, setSelectedDevice] = useState(null)

    const {id} = useParams()
    const {token} = useToken()

    const getUser = async () => {
        const {ok, data, error} = await get(URLS.GetUser.replace("{userId}", id), token)
        if(ok) {
            data.slaId = data.sla
            setUser(data)
            setUpdatedUser(data)
        } else {
            toast.error("Failed to fetch data")
            console.log(error)
        }
    }

    const getGroups = async () => {
        setGroups(await getList(URLS.AllGroups, token))
    }

    const onChange = (key, value) => {
        setUpdatedUser({...updatedUser, [key]: value})
    }

    const getUsers = async () => {
        setUsers(await getList(URLS.AllUsers, token))
    }

    const getDepartments = async () => {
        setDepartments(await getList(URLS.AllDepartments, token))
    }

    const getRoles = async () => {
        setRoles(await getList(URLS.AllRoles, token))
    }

    const getNotAttachedDevices = async () => {
        setNotAttachedDevices(await getList(URLS.NotAttachedDevices, token))
    }

    const getExpLvls = async () => {
        setExpLvlList(await getList(URLS.AllExpLvls, token))
    }

    const confirmChangeStage = async () => {
        const {ok, data, error} = await put(URLS.User, updatedUser, token)
        if(ok) {
            toast.success("Updated!")
            setEdit(false)
            await getUser()
        } else {
            console.log(error)
        }
    }

    const toggleEdit = () => {
       setEdit(!edit)
    }

    useEffect(() => {
        if(edit) {
            setUpdatedUser(user)
        }
    }, [edit])

    const showGroup = () => {
        const group = groups.find(s => s.groupId===user.groupId)
        return (group) ? <Link to={`/group/${user.groupId}/details`}>{user.groupName}</Link> : "";
    }

    const showSupervisor = () => {
        const supervisor = users.find(s => s.userId===user.supervisorId)
        return (supervisor) ? <Link to={`/user/${user.supervisorId}/details`}>{supervisor.fullName}</Link> : "";
    }

    const showDepartment = () => {
        const department = departments.find(s => s.departmentId===user.departmentId)
        return (department) ? department.departmentName : "";
    }

    const showRole = () => {
        const role = roles.find(s => s.roleId===user.roleId)
        return (role) ? role.roleName : "";
    }

    const showExpLvl = () => {
        const exp = expLvlList.find(s => s.expId===user.experienceLevelId)
        return (exp) ? exp.expLevel : "";
    }

    const ticketToParams = () => {
        const inputFields = TEXT_FIELDS.map(field => ({name: field.label, value: 
            <HiddenElement hidden={!edit} ifHidden={user[field.name]}>
                <input value={updatedUser[field.name]} onInput={e => onChange(field.name, e.target.value)}></input>
            </HiddenElement>
        }))

        return [{name: "Number", value: user.userId}, ...inputFields,
            {name: "Group", value:   
                        <HiddenElement hidden={!edit} ifHidden={showGroup()}>
                            <Select
                                keyName="groupId"
                                valueName="groupName"
                                objects={groups}
                                name="groupId"
                                id="groupId"
                                key="groupName"
                                onSelect={e => onChange("groupId", e.target.value)}
                                required={false}
                                selectedValue={updatedUser.groupId}
                                emptyOptionEnabled={true}
                            />
                        </HiddenElement>           
            },
            {name: "Department", value:   
                <HiddenElement hidden={!edit} ifHidden={showDepartment()}>
                    <Select
                     keyName="departmentId" 
                    valueName="departmentName" 
                    objects={departments} 
                    name="departmentId"
                     key="departmentName" 
                     onSelect={e => onChange("departmentId", e.target.value)} 
                     required={true}
                     selectedValue={user.departmentId}
                     />
                </HiddenElement>           
            },
            {name: "Experience Level", value:   
                <HiddenElement hidden={!edit} ifHidden={showExpLvl()}>
                    <Select
                     keyName="expId" 
                     valueName="expLevel" 
                     objects={expLvlList} 
                     name="expId"
                     key="exp" 
                     onSelect={e => onChange("experienceLevelId", e.target.value)} 
                     required={true}
                     selectedValue={user.experienceLevelId}
                     />
                </HiddenElement>           
            },
            {name: "Role", value: 
                <HiddenElement hidden={!edit} ifHidden={showRole()}>
                    <Select
                        keyName="roleId"
                        valueName="roleName"
                        objects={roles}
                        name="roleName"
                        id="roleId"
                        key="roleName"
                        onSelect={e => onChange("roleId", e.target.value)}
                        emptyOptionEnabled={false}
                        selectedValue={updatedUser.roleId}
                        required={true}
                    />
                </HiddenElement>      
            },
            {name: "Supervisor", value:   
                <HiddenElement hidden={!edit} ifHidden={showSupervisor()}>
                    <Select
                        keyName="userId"
                        valueName="fullName"
                        objects={users}
                        name="userId"
                        id="userId"
                        key="user"
                        onSelect={e => onChange("supervisorId", e.target.value)}
                        emptyOptionEnabled={true}
                        selectedValue={updatedUser.supervisorId}
                        required={false}
                    />
                      <button onClick={confirmChangeStage}>Save</button>
                </HiddenElement>           
    }
        ]
    }

    const getDashboard = async (selectedUserId=null) => {
        setDashboard(await getListWithParams(URLS.Dashboard, {userId: selectedUserId}, token))
    }

    const getDevices = async (selectedUserId=null) => {
        setDevices(await getListWithParams(URLS.Devices, {userId: selectedUserId}, token))
    }

    const getStages = async () => {
        await setStages(await getList(URLS.AllStages, token))
    }

    const getStageName = (stageId) => {
        const stage = stages.find(s => s.stageId === stageId)
        if(stage) {
            return stage.stageName
        } else {
            return null
        }
    } 

    const onChangeSelectedDevice = (fieldName, deviceId) => {
        setSelectedDevice(deviceId)
    }

    const attachDevice = async () => {
        if(selectedDevice != null) {
            const body = {
                userId: id,
                deviceId: selectedDevice
            }
            const {ok, data, error} = await post(URLS.AttachDevice, body, token)
            if(ok) {
                setSelectedDevice(null)
                getDevices(id)
                getNotAttachedDevices()
                toast.success("Device attached")
            }
        } else {
            toast.error("Select device first")
        }
    }

    useEffect(() => {
        getUser()
        getGroups()
        getUsers()
        getDepartments()
        getRoles()
        getStages()
        getDashboard(id)
        getDevices(id)
        getNotAttachedDevices()
        getExpLvls()
    }, [id])

    return <div>
        {user && 
        <div>
            <h1>User details <button onClick={toggleEdit}>Edit</button></h1>
            <CommonTable headers={["Param", "Value"]} hideHeaders={true}>
                {ticketToParams().map(p => <TableRow key={p.name} elements={[p.name, p.value]} />)}
            </CommonTable>
            
            <h2>Tickets and applications</h2>
            
            <CommonTable headers={["Type", "Id", "User", "SLA", "Stage"]}>
                {dashboard.map(job => <TableRow key={job.jobId} elements={[job.jobType, (<Link to={"/" + job.jobType + "/" + job.jobId + "/details"}>{job.jobId}</Link>), job.fullName, job.sla, getStageName(job.stageId)]} />)}
            </CommonTable>

            <h2>Devices</h2>
            <div>
                <CommonForm devicesList={notAttachedDevices} onChange={onChangeSelectedDevice}/>
                <button onClick={attachDevice}>Attach device</button>
            </div>

            <CommonTable headers={["Device type",	"Brand",	"Model",	"Serial number"]}>
                {devices.map(dev => <TableRow key={dev.deviceId} elements={[dev.deviceTypeName, dev.brand, dev.model, <Link to={`/device/${dev.deviceId}/details`}>{dev.serialNumber}</Link>]} />)}
            </CommonTable>
        </div>}
    </div>
}

export default UserDetails

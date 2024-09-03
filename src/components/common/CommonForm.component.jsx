import { randPassword } from "../../utils/password"
import Select from "./Select.component"
import { useEffect, useState } from "react"


const CommonForm = ({ onSubmit, onChange, usersList = [], departmentList = [], slaList = [], helpdeskList = [], groupList = [], deviceTypes=[], fields = [], rolesList=[], jobList=[], passwordField=false }) => {
    const [createdPassword, setCreatedPassword] = useState(null)
    const [password, setPassword] = useState(null)

    const generatePassword = () => {
        const newPassword = randPassword(5, 3, 2)
        setCreatedPassword(newPassword)
        setPassword(newPassword)
        onChange("password", newPassword)
    }

    const onPasswordChange = (userPassword) => {
        onChange("password", userPassword)
        setPassword(userPassword)
        setCreatedPassword(null)
    }
    
    useEffect(() => {
        if (usersList.length > 0) {
            onChange("userId", usersList[0].userId)
        }
    }, [usersList])

    return (
        <form className="rounded" onSubmit={onSubmit}>
            {usersList.length > 0 &&
                <div>
                    <label htmlFor="user">User</label>
                    <Select
                        keyName="userId"
                        valueName="fullName"
                        objects={usersList}
                        name="userId"
                        id="userId"
                        key="user"
                        onSelect={e => onChange("userId", e.target.value)}
                        emptyOptionEnabled={usersList.length > 1}
                        required={true}
                    />
                </div>}
            {slaList.length > 0 &&
                <div>
                    <label htmlFor="sla">SLA</label>
                    <Select keyName="slaId" valueName="slaLevel" objects={slaList} name="slaId" key="sla" onSelect={e => onChange("slaId", e.target.value)} required={true} />
                </div>}
            {departmentList.length > 0 &&
                <div>
                    <label htmlFor="department">Department</label>
                    <Select keyName="departmentId" valueName="name" objects={departmentList} name="departmentId" key="department" onSelect={e => onChange("departmentId", e.target.value)} required={true} />
                </div>}

            {helpdeskList.length > 0 &&
                <div>
                    <label htmlFor="user">Helpdesk</label>
                    <Select
                        keyName="userId"
                        valueName="fullName"
                        objects={helpdeskList}
                        name="userId"
                        id="userId"
                        key="user"
                        onSelect={e => onChange("helpdeskId", e.target.value)}
                        emptyOptionEnabled={true}
                        required={true}
                    />
                </div>}

            {groupList.length > 0 &&
                <div>
                    <label htmlFor="group">Group</label>
                    <Select
                        keyName="groupId"
                        valueName="groupName"
                        objects={groupList}
                        name="groupId"
                        id="groupId"
                        key="group"
                        onSelect={e => onChange("groupId", e.target.value)}
                        emptyOptionEnabled={true}
                        required={true}
                    />
                </div>}

            {deviceTypes.length > 0 &&
                <div>
                    <label htmlFor="group">Device type</label>
                    <Select
                        keyName="deviceTypeId"
                        valueName="typeDescription"
                        objects={deviceTypes}
                        name="deviceTypeId"
                        id="deviceTypeId"
                        key="deviceType"
                        onSelect={e => onChange("deviceTypeId", e.target.value)}
                        emptyOptionEnabled={true}
                        required={true}
                    />
                </div>}

                {rolesList.length > 0 &&
                <div>
                    <label htmlFor="role">Role</label>
                    <Select
                        keyName="roleId"
                        valueName="roleName"
                        objects={rolesList}
                        name="roleName"
                        id="roleId"
                        key="roleName"
                        onSelect={e => onChange("roleId", e.target.value)}
                        emptyOptionEnabled={false}
                        required={true}
                    />
                </div>}

                {jobList.length > 0 && 
                <div>
                <label htmlFor="jobType">Job type</label>
                <Select 
                    keyName="name" 
                    valueName="name" 
                    objects={jobList} 
                    id="jobType"
                    name="jobType" 
                    key="jobType" 
                    onSelect={e =>onChange("jobType", e.target.value) }/>
                </div>}





            {fields.map(field =>
                <div>
                    <label htmlFor={field.id}>{field.label}</label>
                    {field.tag === "input" && <input id={field.id}
                        key={field.id} name={field.id}
                        type={field.type}
                        onInput={e => onChange(field.id, field.type === "checkbox" ? e.target.value === "on" : e.target.value)}>
                    </input>}

                    {field.tag === "textarea" && <textarea id={field.id}
                        key={field.id} name={field.id}
                        type={field.type}
                        onInput={e => onChange(field.id, e.target.value)}>
                    </textarea>}
                </div>
            )}

            {passwordField && <>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" value={password} onInput={e => onPasswordChange(e.target.value)} required></input>
                <button type="button" onClick={generatePassword}>Generate password</button>
                {createdPassword && <div>Password: {createdPassword}</div>}
            </>}
        </form>
    )
}

export default CommonForm

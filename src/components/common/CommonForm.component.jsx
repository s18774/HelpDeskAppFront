import { randPassword } from "../../utils/password"
import RequiredField from "./RequiredField.component"
import Select from "./Select.component"
import { useEffect, useState } from "react"


const CommonForm = ({ onSubmit, onChange, usersList = [], departmentList = [], slaList = [],
    helpdeskList = [], groupList = [], deviceTypes = [], fields = [], rolesList = [], jobList = [],
    devicesList = [], passwordField = false, userListLabel = "User", requiredFields = [], expLvlsList = [], types_of_applications=[] }) => {
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
        if (usersList.length == 1) {
            onChange("userId", usersList[0].userId)
        }
    }, [usersList])

    const isRquired = (fieldName) => {
        console.log(requiredFields)
        return requiredFields.includes(fieldName)
    }

    return (
        <form className="border border-primary rounded m-2 p-3 w-25" onSubmit={onSubmit}>
            {usersList.length > 0 &&
                <div>
                    <RequiredField htmlFor="userId" name={userListLabel} required={isRquired("userId")} />
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
                    <RequiredField htmlFor="slaId" name="SLA" required={isRquired("slaId")} />
                    <Select keyName="slaId" valueName="slaLevel" objects={slaList} name="slaId" key="sla" onSelect={e => onChange("slaId", e.target.value)} required={true} />
                </div>}
            {departmentList.length > 0 &&
                <div>
                    <RequiredField htmlFor="departmentId" name="Department" required={isRquired("departmentId")} />
                    <Select keyName="departmentId" valueName="name" objects={departmentList} name="departmentId" key="department" onSelect={e => onChange("departmentId", e.target.value)} required={true} />
                </div>}

            {helpdeskList.length > 0 &&
                <div>
                    <RequiredField htmlFor="userId" name="Helpdesk" required={isRquired("helpdeskId")} />
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
                    <RequiredField htmlFor="groupId" name="Group" required={isRquired("groupId")} />
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
            {expLvlsList.length > 0 &&
                <div>
                    <RequiredField htmlFor="expId" name="Expcerience Level" required={isRquired("expId")} />
                    <Select
                        keyName="expId"
                        valueName="expLevel"
                        objects={expLvlsList}
                        name="expId"
                        id="expId"
                        key="exp"
                        onSelect={e => onChange("experienceLevelId", e.target.value)}
                        emptyOptionEnabled={true}
                        required={true}
                    />
                </div>}

            {deviceTypes.length > 0 &&
                <div>
                    <RequiredField htmlFor="deviceTypeId" name="Device type" required={isRquired("deviceTypeId")} />
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
                    <RequiredField htmlFor="roleName" name="Role" required={isRquired("roleName")} />

                    <Select
                        keyName="roleId"
                        valueName="roleName"
                        objects={rolesList}
                        name="roleName"
                        id="roleId"
                        key="roleName"
                        onSelect={e => onChange("roleId", e.target.value)}
                        emptyOptionEnabled={true}
                        required={true}
                    />
                </div>}

            {jobList.length > 0 &&
                <div>
                    <RequiredField htmlFor="jobType" name="Job type" required={isRquired("jobType")} />
                    <Select
                        keyName="name"
                        valueName="name"
                        objects={jobList}
                        id="jobType"
                        name="jobType"
                        key="jobType"
                        emptyOptionEnabled={false}
                        onSelect={e => onChange("jobType", e.target.value)} />
                </div>}


            {devicesList.length > 0 &&
                <div>
                    <RequiredField htmlFor="deviceId" name="Device" required={isRquired("deviceId")} />
                    <Select
                        keyName="deviceId"
                        valueName="model"
                        objects={devicesList}
                        id="deviceId"
                        name="deviceId"
                        key="deviceId"
                        emptyOptionEnabled={true}
                        nameMapper={dev => dev.brand + " " + dev.model + " (" + dev.serialNumber + ")"}
                        onSelect={e => onChange("deviceId", e.target.value)} />
                </div>}

            {types_of_applications.length > 0 && <div>
                <RequiredField htmlFor="typeOfApplication" name="Type of application" required={isRquired("typeOfApplication")} />
                    <Select
                        keyName="name"
                        valueName="name"
                        objects={types_of_applications}
                        id="typeOfApplication"
                        name="typeOfApplication"
                        key="typeOfApplication"
                        emptyOptionEnabled={true}
                        onSelect={e => onChange("typeOfApplication", e.target.value)} />
            </div>}


            {fields.map(field =>
                <div>
                    <RequiredField htmlFor={field.id} name={field.label} required={field.required} />
                    {field.tag === "input" && <input className={field.type === "checkbox" ? "form-check-input" : "form-control"} id={field.id}
                        key={field.id} name={field.id}
                        type={field.type}
                        defaultValue={field.value}
                        onInput={e => onChange(field.id, field.type === "checkbox" ? e.target.checked : e.target.value)}>
                    </input>}

                    {field.tag === "textarea" && <textarea className="form-control" id={field.id}
                        key={field.id} name={field.id}
                        type={field.type}
                        onInput={e => onChange(field.id, e.target.value)}>
                    </textarea>}
                </div>
            )}

            {passwordField && <>
                <RequiredField htmlFor="password" name="Password" required={isRquired("password")} />
                <input className="form-control" type="password" name="password" id="password" value={password} onInput={e => onPasswordChange(e.target.value)} required></input>
                <button type="button" class="btn btn-primary m-1 w-100" onClick={generatePassword}>Generate password</button>
                {createdPassword && <div>Password: {createdPassword}</div>}
            </>}
        </form>
    )
}

export default CommonForm

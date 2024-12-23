import Select from "./Select.component";
import "./SearchBar.component.css"
import { useContext, useEffect, useState } from "react";
import { URLS, getList } from "../../api/urls";
import TokenContext from "../../context/TokenContext";

const DeviceSearchBar = ({entityName, onSubmit}) => {
    const gridStyle = {
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr"
    }
    
    const [deviceTypeList, setDeviceTypeList] = useState([])
    const [usersList, setUsersList] = useState([])

    const [selectedDeviceTypeId, setSelectedDeviceTypeId] = useState(null)
    const [selectedBrand, setSelectedBrand] = useState(null)
    const [selectedModel, setSelectedModel] = useState(null)
    const [selectedSerialNumber, setSelectedSerialNumber] = useState(null)
    const [selectedUserId, setSelectedUserId] = useState(null)

    const {token} = useContext(TokenContext)

    const getUsers = async () => {
        setUsersList(await getList(URLS.AllUsers, token))
    }

    const getDeviceTypes = async () => {
        setDeviceTypeList(await getList(URLS.AllDeviceTypes, token))
    }

    const onSubmitSearch = () => {
        onSubmit(selectedDeviceTypeId, selectedBrand, selectedModel, selectedSerialNumber, selectedUserId)
    }

    useEffect(() => {
        getUsers()
        getDeviceTypes()
    }, [])

    return ( <div className="rounded search-box">
        <button className="right" onClick={onSubmitSearch}>Search</button>
        <div className="grid-box" style={gridStyle}>
            <label>Device Type</label>
            <label>Brand</label>
            <label>Model</label>
            <label>Serial Number</label>
            <label>User</label>

            <Select keyName="deviceTypeId" valueName="typeDescription" objects={deviceTypeList} name="deviceType" key="deviceType" onSelect={e => setSelectedDeviceTypeId(e.target.value)}/>
            <input value={selectedBrand} onInput={e => setSelectedBrand(e.target.value)}></input>
            <input value={selectedModel} onInput={e => setSelectedModel(e.target.value)}></input>
            <input value={selectedSerialNumber} onInput={e => setSelectedSerialNumber(e.target.value)}></input>
            <Select keyName="userId" valueName="fullName" objects={usersList} name="user" key="user" onSelect={e => setSelectedUserId(e.target.value)} />
        </div>
    </div>)
}

export default DeviceSearchBar;
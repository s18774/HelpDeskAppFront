import { URLS, getListWithParams } from '../../api/urls'
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import TokenContext from "../../context/TokenContext";
import CommonTable from '../common/CommonTable.component';
import DeviceSearchBar from '../common/DeviceSearchBar.component';
import TableRow from '../common/TableRow.component';
import { canCreateNewDevice } from '../../api/roles';


const Device = () => {
    const [devices, setDevices] = useState([])

    const {token} = useContext(TokenContext)
    const navigate = useNavigate()

    const getDevices = async (deviceTypeId=null, brand=null, model=null, serialNumber=null, userId=null) => {
        setDevices(await getListWithParams(URLS.AllDevices, {deviceTypeId: deviceTypeId, userId: userId, brand: brand, model: model, serialNumber: serialNumber}, token))
    }

    useEffect(() => {
        getDevices()
    }, [])


    return <div>
        <h1>Devices</h1>

        {token != null && canCreateNewDevice(token) &&
        <button onClick={() => navigate("/device/create")}>Create device</button>}

        <DeviceSearchBar onSubmit={getDevices}/>

        <CommonTable headers={["Device type", "Brand", "Model", "Serial number", "User"]}>
            {devices.map(device => <TableRow key={device.serialNumber} elements={[device.deviceTypeName, device.brand, 
                device.model, <Link to={`/device/${device.deviceId}/details`}>{device.serialNumber}</Link>,  <Link to={`/user/${device.userId}/details`}>{device.fullName}</Link>]} />)}
        </CommonTable>
    </div>
}

export default Device
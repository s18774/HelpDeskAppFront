import { URLS, getListWithParams } from '../../api/urls'
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import TokenContext from "../../context/TokenContext";
import CommonTable from '../common/CommonTable.component';
import DeviceSearchBar from '../common/DeviceSearchBar.component';
import TableRow from '../common/TableRow.component';
import { canCreateNewDevice } from '../../api/roles';


const Group = () => {
    const [groups, setDevices] = useState([])

    const {token} = useContext(TokenContext)
    const navigate = useNavigate()

    const getGroups = async (groupName, isActivate) => {
        setDevices(await getListWithParams(URLS.AllGroups, {groupName, isActivate}, token))
    }

    useEffect(() => {
        getGroups()
    }, [])


    return <div>
        <h1>Groups</h1>

        {canCreateNewDevice(token) &&
        <button onClick={() => navigate("/group/create")}>Create group</button>}

        <CommonTable headers={["Number", "Name", "Active"]}>
            {groups.map(group => <TableRow key={group.groupId} elements={[<Link to={`/group/${group.groupId}/details`}>{group.groupId}</Link>, group.groupName, group.isGroupActive === 1 ? "Yes": "No"]} />)}
        </CommonTable>
    </div>
}

export default Group
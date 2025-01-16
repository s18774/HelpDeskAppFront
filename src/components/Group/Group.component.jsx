import { URLS, getListWithParams } from '../../api/urls'
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import TokenContext from "../../context/TokenContext";
import CommonTable from '../common/CommonTable.component';
import TableRow from '../common/TableRow.component';
import { canCreateNewDevice } from '../../api/roles';


const Group = () => {
    const [groups, setDevices] = useState([])

    const { token } = useContext(TokenContext)
    const navigate = useNavigate()

    const getGroups = async (groupName, isActivate) => {
        setDevices(await getListWithParams(URLS.AllGroups, { groupName, isActivate }, token))
    }

    useEffect(() => {
        getGroups()
    }, [])


    return <div>
        <h1 className="text-center m-2 mb-3">Groups</h1>



        <div className="d-flex flex-column justify-content-center align-items-center">
        <CommonTable headers={["Number", "Name", "Active"]} sx={"w-50"}>
            {groups.map(group => <TableRow key={group.groupId} elements={[<Link to={`/group/${group.groupId}/details`}>{group.groupId}</Link>, group.groupName, group.isGroupActive === 1 ? "Yes" : "No"]} />)}
        </CommonTable>
        {canCreateNewDevice(token) &&
            <button className='btn btn-primary' onClick={() => navigate("/group/create")}>Create group</button>}
        </div>

    </div>
}

export default Group
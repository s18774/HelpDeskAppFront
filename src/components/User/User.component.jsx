import { URLS, getListWithParams } from '../../api/urls'
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import TokenContext from "../../context/TokenContext";
import CommonTable from '../common/CommonTable.component';
import TableRow from '../common/TableRow.component';
import UserSearchBar from '../common/UserSearchBar.component';
import { canCreateUser } from '../../api/roles';


const User = () => {
    const [users, setUsers] = useState([])

    const { token } = useContext(TokenContext)
    const navigate = useNavigate()

    const getUsers = async (firstName = null, secondName = null, positionName = null, groupName = null) => {
        setUsers(await getListWithParams(URLS.AllUsersDetails, { firstName: firstName, secondName: secondName, positionName: positionName, groupName: groupName }, token))
    }

    useEffect(() => {
        getUsers()
    }, [])


    return <div>
        <h1>Users</h1>

        {canCreateUser(token) &&
            <button onClick={() => navigate("/user/create")}>Create user</button>}

        <UserSearchBar onSubmit={getUsers} />

        <CommonTable headers={["First Name", "Second Name", "Position", "Group"]}>
            {users.map(user => <TableRow key={user.userId} elements={
                [
                    <Link to={`/user/${user.userId}/details`}>{user.firstName}</Link>,
                    <Link to={`/user/${user.userId}/details`}>{user.secondName}</Link>,
                    user.positionName,
                    <Link to={`/group/${user.groupId}/details`}>{user.groupName}</Link>
                ]} />)}
        </CommonTable>
    </div>
}

export default User
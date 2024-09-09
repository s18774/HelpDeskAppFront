import { Link } from 'react-router-dom'
import "./Navbar.component.css"
import { useContext, useEffect, useState } from 'react'
import { canCreateReport, canSeeAllUsers, getRoleName, getUserFromToken } from '../../api/roles'
import TokenContext from '../../context/TokenContext'


const URLS = [
    { url: "/dashboard", name: "Dashboard" },
    { url: "/ticket", name: "Tickets" },
    { url: "/application", name: "Application" },
    { url: "/device", name: "Devices" },
    { url: "/group", name: "Groups" },
]


const Navbar = () => {
    const [user, setUser] = useState({})
    const { token } = useContext(TokenContext)
    const [urls, setUrls] = useState(URLS)


    useEffect(() => {
        if (token != null) {
            setUser(getUserFromToken(token))
            const newUrls = [{url: "/logout", name: "Logout"}, ...URLS]
            if(canSeeAllUsers(token)) {
                newUrls.push({url: "/user", name: "Users"})
            }
            if(canCreateReport(token)) {
                newUrls.push( { url: "/report", name: "Reports" })
            }
            setUrls(newUrls)
        } else {
            setUser({})
            setUrls([{url: "/login", name: "Login"}, ...URLS])
        }
    }, [token])

    return <nav>
        <ul className='menu-list'>
            {urls.map(u => <li><Link to={u.url}>{u.name}</Link></li>)}
            <li>{token != null ? user.fullName + " (" + getRoleName(user.role) + ")" : "Guest"}</li>
        </ul>
    </nav>
}

export default Navbar
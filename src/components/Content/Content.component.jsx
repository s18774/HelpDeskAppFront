import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "../Login/Login.component"
import Application from '../Application/Application.component'
import Logout from "../Logout/Logout.component"
import Ticket from "../Ticket/Ticket.component"
import Dashboard from "../Dashboard/Dashboard.component"
import CreateTicket from "../CreateTicket/CreateTicket.component"
import CreateApplication from "../CreateApplication/CreateApplication.component"
import Device from "../Device/Device.component"
import CreateDevice from "../CreateDevice/CreateDevice.component"
import User from "../User/User.component"
import CreateUser from "../CreateUser/CreateUser.component"
import TicketDetails from "../TicketDetails/TicketDetails.component"
import ApplicationDetails from "../ApplicationDetails/ApplicationDetails.component"
import UserDetails from "../UserDetails/UserDetails.component"
import Group from "../Group/Group.component"
import CreateGroup from "../CreateGroup/CreateGroup.component"
import GroupDetails from "../GroupDetails/GroupDetails.component"
import Report from "../Report/Report.component"
import DeviceDetails from "../DeviceDetails/DeviceDetails.component"
import Logs from "../Logs/Logs.component"

const Content = () => {
    return <div>
            <Routes>
                <Route path="/login" element={<Login/>} />
                <Route path="/logout" element={<Logout/>} />

                <Route path="/application" element={<Application/>} />
                <Route path="/application/:id/details" element={<ApplicationDetails/>} />
                <Route path="/application/create" element={<CreateApplication/>} />

                <Route path="/ticket" element={<Ticket/>} />
                <Route path="/ticket/:id/details" element={<TicketDetails/>} />
                <Route path="/ticket/create" element={<CreateTicket/>} />

                <Route path="/device" element={<Device/>} />
                <Route path="/device/:id/details" element={<DeviceDetails/>}/>
                <Route path="/device/create" element={<CreateDevice/>} />

                <Route path="/user" element={<User/>} />
                <Route path="/user/:id/details" element={<UserDetails/>} />
                <Route path="/user/create" element={<CreateUser/>} />

                <Route path="/group" element={<Group/>} />
                <Route path="/group/:id/details" element={<GroupDetails/>} />
                <Route path="/group/create" element={<CreateGroup/>} />

                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/report" element={<Report/>}/>

                <Route path="/log" element={<Logs/>}/>
            </Routes>
    </div>
}

export default Content
import { URLS, getList, getListWithParams } from '../../api/urls'
import { useEffect, useState } from "react"
import SearchBar from "../common/SearchBar.component";
import { Link, useNavigate } from "react-router-dom";
import { useToken } from "../../context/TokenContext";
import CommonTable from '../common/CommonTable.component';
import TableRow from '../common/TableRow.component';


const Ticket = () => {
    const [tickets, setTickets] = useState([])
    const [stages, setStages] = useState([])

    const { token } = useToken()
    const navigate = useNavigate()

    const getTickets = async (selectedId = null, selectedUserId = null, selectedSlaId = null, selectedStageId = null) => {
        setTickets(await getListWithParams(URLS.Tickets, { ticketId: selectedId, userId: selectedUserId, slaId: selectedSlaId, stageId: selectedStageId }, token))
    }

    const getStages = async () => {
        await setStages(await getList(URLS.AllStages, token))
    }

    const getStageName = (stageId) => {
        const stage = stages.find(s => s.stageId === stageId)
        if (stage) {
            return stage.stageName
        } else {
            return null
        }
    }

    useEffect(() => {
        getStages()
    }, [])

    useEffect(() => {
        if (stages.length > 0) {
            getTickets(null, null, null, getOpenStageId())
        }
    }, [stages])

    const getOpenStageId = () => {
        const stage = stages.find(s => s.stageName === "Open")
        if (stage) {
            return stage.stageId
        } else {
            return null
        }
    }


    return <div>
        <h1>Tickets</h1>

        {token != null &&
            <button onClick={() => navigate("/ticket/create")}>Create ticket</button>}

        {stages.length > 0 &&
            <SearchBar onSubmit={getTickets} stage={getOpenStageId()} />}

        <CommonTable headers={["Number", "SLA", "Opening date", "Title", "User", "Stage"]}>
            {tickets.map(app => <TableRow key={app.ticketId} elements={[<Link to={`/ticket/${app.ticketId}/details`}>{app.ticketId}</Link>,
            app.sla, app.openingDate, app.title, <Link to={`/user/${app.userId}/details`}>{app.fullName}</Link>, getStageName(app.stageId)]} />)}
        </CommonTable>
    </div>
}

export default Ticket
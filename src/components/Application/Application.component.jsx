import { URLS, getList } from "../../api/urls"
import { useContext, useEffect, useState } from "react"
import SearchBar from "../common/SearchBar.component"
import { getListWithParams } from "../../api/urls"
import TokenContext from "../../context/TokenContext"
import { Link, useNavigate } from "react-router-dom"
import CommonTable from "../common/CommonTable.component"
import TableRow from "../common/TableRow.component"


const Application = () => {
    const [applications, setApplications] = useState([])
    const [stages, setStages] = useState([])
    const navigate = useNavigate()
    const { token } = useContext(TokenContext)

    const getApplications = async (selectedId = null, selectedUserId = null, selectedSlaId = null, selectedStageId = null) => {
        setApplications(await getListWithParams(URLS.Applications, { applicationNumber: selectedId, userId: selectedUserId, slaId: selectedSlaId, stageId: selectedStageId }, token))
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
            getApplications(null, null, null, getOpenStageId())
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
        <h1 className="text-center m-2 mb-3">Applications</h1>
        {
            stages.length > 0 &&
            <SearchBar onSubmit={getApplications} stage={getOpenStageId()} additionalButton={token != null &&
                < button className="btn btn-primary" onClick={() => navigate("/application/create")}>Create application</button>} />
        }

        <CommonTable headers={["Number", "SLA", "Opening date", "Subject", "User", "Stage"]}>
            {applications.map(app => <TableRow key={app.applicationId} elements={[app.applicationNumber,
            app.sla, app.openingDate, <Link to={`/application/${app.applicationId}/details`}>{app.subject}</Link>, <Link to={`/user/${app.userId}/details`}>{app.fullName}</Link>, getStageName(app.stageId)]} />)}
        </CommonTable>
    </div >
}

export default Application
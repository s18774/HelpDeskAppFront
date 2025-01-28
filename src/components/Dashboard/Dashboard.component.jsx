import { useContext, useEffect, useState } from "react"
import TokenContext from "../../context/TokenContext"
import { URLS, getList, getListWithParams } from "../../api/urls"
import SearchBar from "../common/SearchBar.component"
import TableRow from "../common/TableRow.component"
import CommonTable from "../common/CommonTable.component"
import { Link } from "react-router-dom"



const Dashboard = () => {
    const [dashboard, setDashboard] = useState([])
    const [stages, setStages] = useState([])
    const {token} = useContext(TokenContext)

    const getDashboard = async (selectedId=null, selectedUserId=null, selectedSlaId=null, selectedStageId=null, jobType=null) => {
        setDashboard(await getListWithParams(URLS.Dashboard, {id: selectedId, userId: selectedUserId, slaId: selectedSlaId, stageId: selectedStageId, jobType: jobType}, token))
    }

    const getStages = async () => {
        await setStages(await getList(URLS.AllStages, token))
    }

    const getStageName = (stageId) => {
        const stage = stages.find(s => s.stageId === stageId)
        if(stage) {
            return stage.stageName
        } else {
            return null
        }
    } 

    const getJobLink = (job) => {
        return <Link to={`/${job.jobType}/${job.jobId}/details`}>{job.jobId}</Link>
    }

    useEffect(() => {
        getDashboard()
        getStages()
    }, [])

    return <div>
        <h1 className="text-center m-2 mb-3">Dashboard</h1>

        <SearchBar onSubmit={getDashboard} jobType={true}/>
        <CommonTable headers={["Type", "Title", "Id", "User", "SLA", "Stage"]}>
            {dashboard.map(job => <TableRow key={job.jobId+job.type} elements={[
                job.jobType, 
                job.title,
                getJobLink(job), 
                <Link to={`/user/${job.userId}/details`}>{job.fullName}</Link>, 
                job.sla, 
                getStageName(job.stageId)]} />)}
        </CommonTable>
    </div>
}

export default Dashboard
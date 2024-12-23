import { useContext, useEffect, useState } from "react"
import { getList, URLS } from "../../api/urls"
import TokenContext from "../../context/TokenContext"
import CommonTable from "../common/CommonTable.component"
import TableRow from "../common/TableRow.component"


const Logs = () => {
    const [logs, setLogs] = useState([])
    const { token } = useContext(TokenContext)

    const getLogs = async () => {
        setLogs(await getList(URLS.AllLogs, token))
    }

    useEffect(() => {
        getLogs()
    }, [])

    return <div>
        <CommonTable headers={["Date", "Description"]}>
            {logs.map(log => <TableRow key={log.logsId} elements={[log.date, log.description]} />)}
        </CommonTable>
    </div>
}

export default Logs

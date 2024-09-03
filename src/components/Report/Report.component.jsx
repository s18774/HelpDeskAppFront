import { useEffect, useRef, useState } from "react";
import CommonForm from "../common/CommonForm.component";
import { useToken } from "../../context/TokenContext";
import { getFileWithParams, getList, URLS } from "../../api/urls";
import JOB_TYPES from "../../api/jobTypes";
import fileDownload from "js-file-download";


const FORM_FIELDS = [
    {id: "dateFrom", label: "Date From", type: "date", tag: "input", required: true},
    {id: "dateTo", label: "Date To", type: "date", tag: "input", required: true},
]

const Report = () => {
    const [helpdesks, setHelpdesks] = useState([])
    const {token} = useToken()
    const [reportParams, setReportParams] = useState({})
    const ref = useRef(null);

    const getHelpdesk = async () => {
        setHelpdesks(await getList(URLS.AllHelpdesk, token))
    }

    const onChangeForm = (fieldName, value) => {
        const newReportParams = { ...reportParams, [fieldName]: value }
        setReportParams(newReportParams)
    }

    const generateReport = async () => {
        const data = await getFileWithParams(URLS.ReportHelpdesk, reportParams, token)
        fileDownload(data, "report.pdf")
        console.log("OK download")
    }

    useEffect(() => {
        getHelpdesk()
    }, [])

    return <div>
        <h1>Reports</h1>
        <CommonForm onChange={onChangeForm} helpdeskList={helpdesks} fields={FORM_FIELDS} jobList={JOB_TYPES} />
        <button onClick={generateReport}>Generate report</button>
    </div>
}

export default Report;
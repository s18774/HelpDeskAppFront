import { useEffect, useRef, useState } from "react";
import CommonForm from "../common/CommonForm.component";
import { useToken } from "../../context/TokenContext";
import { getFileWithParams, getList, URLS } from "../../api/urls";
import JOB_TYPES from "../../api/jobTypes";
import fileDownload from "js-file-download";
import { getUserId, isHelpdesk } from "../../api/roles";
import { decodeToken } from "react-jwt";

const getDateMonthAgo = () => {
    var d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d
}

const dateToString = (date) => {
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let dateStr = date.getFullYear() + "-" + (month) + "-" + (day);
    return dateStr
}

const FORM_FIELDS = [
    { id: "dateFrom", label: "Date From", type: "date", tag: "input", required: true, value: dateToString(getDateMonthAgo()) },
    { id: "dateTo", label: "Date To", type: "date", tag: "input", required: true, value: dateToString(new Date()) },
]


const Report = () => {
    const [helpdesks, setHelpdesks] = useState([])
    const { token } = useToken()
    const [reportParams, setReportParams] = useState({ jobType: "all", "dateFrom": dateToString(getDateMonthAgo()), "dateTo": dateToString(new Date()) })
    const ref = useRef(null);

    const getHelpdesk = async () => {
        let helpdesks = await getList(URLS.AllHelpdesk, token)
        let data = decodeToken(token)
        if(isHelpdesk(data)) {
            const currentHeldeskId = getUserId(token)
            helpdesks = helpdesks.filter(h => h.userId == currentHeldeskId)
        }
        setHelpdesks(helpdesks)
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
        <h1 className="text-center m-2 mb-3">Reports</h1>
        <div className="d-flex flex-column justify-content-center align-items-center">
            <CommonForm onChange={onChangeForm} helpdeskList={helpdesks} fields={FORM_FIELDS} jobList={[{ name: "all" }, ...JOB_TYPES]} />
            <button className="btn btn-primary" onClick={generateReport}>Generate report</button>
        </div>

    </div>
}

export default Report;
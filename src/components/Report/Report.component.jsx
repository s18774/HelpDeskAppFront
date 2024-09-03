import { useEffect, useState } from "react";
import CommonForm from "../common/CommonForm.component";
import { useToken } from "../../context/TokenContext";
import { getList, URLS } from "../../api/urls";


const FORM_FIELDS = [
    {id: "dateFrom", label: "Date From", type: "date", tag: "input", required: true},
    {id: "dateTo", label: "Date To", type: "date", tag: "input", required: true},
]

const Report = () => {
    const [helpdesks, setHelpdesks] = useState([])
    const {token} = useToken()
    const [reportParams, setReportParams] = useState({})

    const getHelpdesk = async () => {
        setHelpdesks(await getList(URLS.AllHelpdesk, token))
    }

    const onChangeForm = (fieldName, value) => {
        const newReportParams = { ...reportParams, [fieldName]: value }
        setReportParams(newReportParams)
    }

    const generateReport = () => {

    }

    useEffect(() => {
        getHelpdesk()
    }, [])

    return <div>
        <h1>Reports</h1>
        <CommonForm onChange={onChangeForm} helpdeskList={helpdesks} fields={FORM_FIELDS} />
        <button onSubmit={generateReport}>Generate report</button>
    </div>
}

export default Report;
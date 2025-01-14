import Select from "./Select.component";
import "./SearchBar.component.css"
import { useContext, useEffect, useState } from "react";
import { URLS, getList } from "../../api/urls";
import TokenContext from "../../context/TokenContext";
import JOB_TYPES from "../../api/jobTypes";

const SearchBar = ({entityName, onSubmit, jobType=false, stage=null}) => {
    const gridStyle = {
        gridTemplateColumns: "1fr 1fr 1fr 1fr" + (jobType ? " 1fr" : "")
    }
    
    const [slaList, setSlaList] = useState([])
    const [stages, setStages] = useState([])
    const [usersList, setUsersList] = useState([])
    const [selectedId, setSelectedId] = useState(null)
    const [selectedUserId, setSelectedUserId] = useState(null)
    const [selectedSlaId, setSelectedSlaId] = useState(null)
    const [selectedJobType, setSelectedJobType] = useState(null)
    const [selectedStageId, setSelectedStageId] = useState(stage)

    const {token} = useContext(TokenContext)

    const getUsers = async () => {
        setUsersList(await getList(URLS.AllUsers, token))
    }

    const getSLA = async () => {
        setSlaList(await getList(URLS.AllSLA, token))
    }

    const getStages = async () => {
        await setStages(await getList(URLS.AllStages, token))
    }

    const onSubmitSearch = () => {
        if(jobType) {
            onSubmit(selectedId, selectedUserId, selectedSlaId, selectedStageId, selectedJobType)
        } else {
            onSubmit(selectedId, selectedUserId, selectedSlaId, selectedStageId)
        }
    }

    useEffect(() => {
        getUsers()
        getSLA()
        getStages()
    }, [])

    return ( <div className="rounded search-box">
        <button className="right btn btn-primary" onClick={onSubmitSearch}>Search</button>
        <div className="grid-box" style={gridStyle}>
            {jobType && <label>Type</label>}
            <label>{entityName} number</label>
            <label>User</label>
            <label>SLA</label>
            <label>Stage</label>

            {jobType && <Select keyName="name" valueName="name" objects={JOB_TYPES} name="jobType" key="jobType" onSelect={e =>setSelectedJobType(e.target.value) }/>}
            <input value={selectedId} onInput={e => setSelectedId(e.target.value)}></input>
            <Select keyName="userId" valueName="fullName" objects={usersList} name="user" key="user" onSelect={e => setSelectedUserId(e.target.value)} />
            <Select keyName="slaId" valueName="slaLevel" objects={slaList} name="sla" key="sla" onSelect={e => setSelectedSlaId(e.target.value)}/>
            <Select keyName="stageId" valueName="stageName" objects={stages} name="stage" key="stage" selectedValue={selectedStageId} onSelect={e => setSelectedStageId(e.target.value)}/>
        </div>
    </div>)
}

export default SearchBar;
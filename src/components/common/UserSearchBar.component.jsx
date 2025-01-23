import Select from "./Select.component";
import "./SearchBar.component.css"
import { useContext, useEffect, useState } from "react";
import { URLS, getList } from "../../api/urls";
import TokenContext from "../../context/TokenContext";
import JOB_TYPES from "../../api/jobTypes";

const UserSearchBar = ({onSubmit, additionalButton=null}) => {
    const gridStyle = {
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr"
    }
    const labels = [
        "Firstname", "Secondname", "Position", "Group"
    ]

    const [selectedFirstname, setSelectedFirstname] = useState(null)
    const [selectedSecondname, setSelectedSecondname] = useState(null)
    const [selectedPosition, setSelectedPosition] = useState(null)
    const [selectedGroup, setSelectedGroup] = useState(null)


    const onSubmitSearch = () => {
        onSubmit(selectedFirstname, selectedSecondname, selectedPosition, selectedGroup)
    }

    return ( <div className="border border-primary rounded m-2 p-3">

        <div className="grid-box" style={gridStyle}>
            {labels.map(le => <label key={le}>{le}</label>)}
            {additionalButton != null ? additionalButton : <div></div>}

            <input className="form-control" value={selectedFirstname} onInput={e => setSelectedFirstname(e.target.value)}></input>
            <input className="form-control" value={selectedSecondname} onInput={e => setSelectedSecondname(e.target.value)}></input>
            <input className="form-control" value={selectedPosition} onInput={e => setSelectedPosition(e.target.value)}></input>
            <input className="form-control" value={selectedGroup} onInput={e => setSelectedGroup(e.target.value)}></input>
            <button className="btn btn-primary" onClick={onSubmitSearch}>Search</button>
        </div>
    </div>)
}

export default UserSearchBar;
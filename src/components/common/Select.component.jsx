const Select = ({objects, keyName, valueName, name, onSelect, 
    emptyOptionEnabled=true, required=false, selectedValue=null, nameMapper=null}) => {
    return (
        <select name={name} id={name} onChange={onSelect} required={required}>
            { emptyOptionEnabled && <option></option>}
            {objects.map(obj => <option value={obj[keyName]} selected={selectedValue != null && selectedValue === obj[keyName]}>{ nameMapper == null ? obj[valueName] : nameMapper(obj)}</option>)}
        </select>
    )
}

export default Select;
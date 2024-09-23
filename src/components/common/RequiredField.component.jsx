const RequiredField = ({htmlFor, name, required}) => {
    return (
        <label htmlFor={htmlFor}>{name + ""}{required && <span style={{color: "red"}}>*</span>} </label>
    )
}

export default RequiredField
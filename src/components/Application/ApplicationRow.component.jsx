const ApplicationRow = ({id, sla, openingDate, title, user}) => {
    return (
        <tr>
            <td>{id}</td>
            <td>{sla}</td>
            <td>{openingDate}</td>
            <td>{title}</td>
            <td>{user}</td>
        </tr>
    )
}

export default ApplicationRow
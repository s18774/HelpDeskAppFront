const TableRow = ({elements=[]}) => {
    return (
        <tr>
            {elements.map(e => <td>{e}</td>)}
        </tr>
    )
}

export default TableRow

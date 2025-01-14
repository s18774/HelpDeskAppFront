const CommonTable = ({children, headers=[], hideHeaders=false}) => {
   return ( <table className="table table-striped">
    {!hideHeaders &&
    <thead>
        <tr>
            {headers.map(h => <th>{h}</th>)}
        </tr>
    </thead>}
    <tbody>
        {children}
    </tbody>
</table>)
}

export default CommonTable
const CommonTable = ({children, headers=[], hideHeaders=false}) => {
   return ( <table style={{width: "100%"}}>
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
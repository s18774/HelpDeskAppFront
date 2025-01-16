const CommonTable = ({children, headers=[], hideHeaders=false, sx=null}) => {
   return ( 
   <div className={"border border-primary rounded m-2 p-2 " +  sx}>
    <table className={"table table-striped "}>
    {!hideHeaders &&
    <thead>
        <tr>
            {headers.map(h => <th>{h}</th>)}
        </tr>
    </thead>}
    <tbody>
        {children}
    </tbody>
</table></div>)
}

export default CommonTable
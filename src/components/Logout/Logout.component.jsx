import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import TokenContext from "../../context/TokenContext"

const Logout =  () => {
    const navigate = useNavigate()
    const {setToken} = useContext(TokenContext)

    useEffect(() => {
        setToken(null)
        navigate("/login")
    }, [])
}

export default Logout
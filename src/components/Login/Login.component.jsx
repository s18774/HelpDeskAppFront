import { useNavigate } from "react-router-dom"
import { URLS } from "../../api/urls"
import "./Login.component.css"
import axios from 'axios'
import toast from "react-hot-toast"
import { useContext } from "react"
import TokenContext from "../../context/TokenContext"

const Login = () => {
    const navigate = useNavigate()
    const { setToken } = useContext(TokenContext)

    const handleForm = async (e) => {
        e.preventDefault()
        let formData = new FormData(e.target)
        let body = Object.fromEntries(formData)
        try {
            let response = await axios.post(URLS.Auth, body)
            if (response.status === 200) {
                toast.success("OK")
                setToken(response.data)
                navigate("/application")
            } else {
                toast.error("Błąd")
            }
        } catch (err) {
            console.log(err)
            toast.error("Błąd")
        }

    }

    return <div>
        <form onSubmit={handleForm} className="login-form">
            <label for="username">Username</label>
            <input name="username" id="username"></input>
            <label for="password">Password</label>
            <input name="password" id="password" type="password"></input>
            <button class="btn btn-primary" type="submit">Login</button>
        </form>
    </div>
}

export default Login
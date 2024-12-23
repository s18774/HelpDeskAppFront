import { createContext, useContext, useEffect, useState } from "react";


const TokenContext = createContext({ token: null, setToken: null })

export const useToken = () => {
  return useContext(TokenContext)
}

export const TokenWrapper = ({ children }) => {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")))

  useEffect(() => {
    if (token == null) {
      localStorage.clear("token")
    } else {
      localStorage.setItem("token", JSON.stringify(token))
    }
  }, [token])

  return (
    <TokenContext.Provider value={{ token: token, setToken: setToken }}>{children}</TokenContext.Provider>
  )
}

export default TokenContext
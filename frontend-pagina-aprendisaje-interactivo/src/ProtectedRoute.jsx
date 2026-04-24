import { useLogin} from "./context/LoginContext"
import { Navigate,Outlet} from "react-router-dom";

function ProtectedRote() {
    const {isAuthenticated} = useLogin()
    if (!isAuthenticated) return <Navigate to='/login' replace/>
    return(
        <Outlet/>
    )
}

export default ProtectedRote
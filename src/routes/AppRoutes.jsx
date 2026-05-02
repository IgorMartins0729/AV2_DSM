import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "../pages/Login" 
import RotasInternas from "../routes/AppRoutes.jsx" 

function AppRoutes() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            <Route path="/login" element={<Login />} />

            <Route path="/*" element={<RotasInternas />} />
        </Routes>
    </BrowserRouter>
    //Sonaca Brasil
  )
}

export default AppRoutes
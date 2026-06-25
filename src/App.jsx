import Menu from "../src/pages/Menu/Menu";
import Layout from "./layout/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLogin from "./pages/Admin/AdminLogin";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="menu" element={<Menu />} />
                    <Route path="about" element={<About/>} />
                    <Route path="admin" element={<AdminDashboard />} />
                    <Route path="admin/login" element={<AdminLogin />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

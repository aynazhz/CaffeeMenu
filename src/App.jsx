import Menu from "../src/pages/Menu/Menu";
import Layout from "./layout/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="menu" element={<Menu />} />
                    <Route path="about" element={<About/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
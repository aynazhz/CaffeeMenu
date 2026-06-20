import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import './Layout.css'
import Footer from "../components/Footer/Footer";


export default function Layout() {

    return (
        <>

            <Navbar />
          

            <main className="main-layout">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

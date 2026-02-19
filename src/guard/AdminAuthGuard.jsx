import { Outlet } from "react-router-dom";
import Navbaradmin from "../components/Admin/NavbarAdmin";
import Sidebaradmin from "../components/Admin/SidebarAdmin";

export const Adminauthguard = () => {

  return (
    <>
        
        <Navbaradmin />
        <Sidebaradmin/>
        <Outlet />
          
    </>
  );
};
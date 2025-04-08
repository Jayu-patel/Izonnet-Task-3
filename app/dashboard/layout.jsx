import ConfirmationPopup from "../components/Pop-up";
import NavbarDashboard from "./@navbar/page";

export default function DashboardLayout({ children, navbar }) {
  return (
    <div className="flex h-screen">
        {/* <div className="h-auto">{navbar}</div> */}
        <NavbarDashboard/>
        <div className="w-[calc(100vw-16rem)] large:ml-64 medium:w-[calc(100%-3.5rem)] medium:ml-14">{children}</div>
        <ConfirmationPopup/>
    </div>
  );
}

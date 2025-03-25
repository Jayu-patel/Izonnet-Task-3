import ConfirmationPopup from "../components/Pop-up";
import NavbarDashboard from "./@navbar/page";

export default function DashboardLayout({ children, navbar }) {
  return (
    <div className="flex h-screen">
        {/* <div className="h-auto">{navbar}</div> */}
        <NavbarDashboard/>
        <div className="w-[calc(100vw-16rem)] ml-64">{children}</div>
        <ConfirmationPopup/>
    </div>
  );
}

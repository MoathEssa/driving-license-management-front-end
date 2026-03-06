import { Outlet, useNavigate } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@shared/ui/sidebar";
import { useAppDispatch } from "@app/store";
import { toggleLanguage } from "@app/store/slices/languageSlice";
import { logout } from "@features/auth/store/authSlice";
import { useLogoutMutation } from "@features/auth/store/authApi";
import { AppSidebar } from "./sidebar";
import { SiteHeader } from "./SiteHeader";
import { AuthGuard } from "@app/router/guards";

const ApplicationLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [triggerLogout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await triggerLogout();
    } finally {
      dispatch(logout());
      navigate("/auth/sign-in", { replace: true });
    }
  };

  const handleLanguageChange = () => {
    dispatch(toggleLanguage());
  };

  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar
          onLogout={handleLogout}
          onLanguageChange={handleLanguageChange}
        />
        <SidebarInset className="flex flex-col min-w-0 overflow-hidden">
          <SiteHeader />
          <div className="flex-1 min-h-0 overflow-auto p-4">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
};

export default ApplicationLayout;

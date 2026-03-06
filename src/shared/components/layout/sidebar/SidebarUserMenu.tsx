import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAppSelector } from "@app/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@shared/ui/sidebar";
import { Avatar, AvatarFallback } from "@shared/ui/avatar";
import { ChevronsUpDown, Globe, LogOut, Settings } from "lucide-react";

interface SidebarUserMenuProps {
  onLogout: () => void;
  onLanguageChange: () => void;
}

export function SidebarUserMenu({
  onLogout,
  onLanguageChange,
}: SidebarUserMenuProps) {
  const { t } = useTranslation();
  const { isMobile } = useSidebar();
  const authData = useAppSelector((state) => state.auth.authData);
  const language = useAppSelector((state) => state.language.current);

  const user = authData?.user;
  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-start text-sm leading-tight">
              <span className="truncate font-semibold">
                {user?.fullName ?? "Guest"}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user?.email ?? ""}
              </span>
            </div>
            <ChevronsUpDown className="ms-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          side={isMobile ? "bottom" : "right"}
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.fullName ?? "Guest"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.email ?? ""}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLanguageChange}>
            <Globe className="me-2 size-4" />
            {language === "ar" ? "English" : "العربية"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/account/settings">
              <Settings className="me-2 size-4" />
              {t("sidebar.nav.accountSettings")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout}>
            <LogOut className="me-2 size-4" />
            {t("auth.logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

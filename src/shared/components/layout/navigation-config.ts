import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardCheck,
  ShieldCheck,
  CreditCard,
  FilePlus,
  MapPin,
  Globe,
  RefreshCw,
  Replace,
  Unlock,
  ClipboardList,
  Lock,
  Car,
  Settings,
} from "lucide-react";

export interface NavItem {
  id: string;
  titleKey: string; // i18n key
  icon?: LucideIcon;
  url?: string;
  items?: NavItem[]; // nested sub-items (supports 3 levels)
  badge?: number;
  roles?: string[];
}

export interface NavGroup {
  id: string;
  titleKey: string;
  items: NavItem[];
}

export const navigationConfig: NavGroup[] = [
  // ── Main ────────────────────────────────────────────────────────────────
  {
    id: "main",
    titleKey: "sidebar.groups.main",
    items: [
      {
        id: "dashboard",
        titleKey: "sidebar.nav.dashboard",
        icon: LayoutDashboard,
        url: "/",
      },
    ],
  },

  // ── Applications ────────────────────────────────────────────────────────
  {
    id: "applications",
    titleKey: "sidebar.groups.applications",
    items: [
      // Level 1 → Level 2 → Level 3
      {
        id: "driving-licenses-services",
        titleKey: "sidebar.nav.drivingLicensesServices",
        icon: CreditCard,
        items: [
          {
            id: "new-driving-license",
            titleKey: "sidebar.nav.newDrivingLicense",
            icon: FilePlus,
            items: [
              {
                id: "local-license",
                titleKey: "sidebar.nav.localLicense",
                icon: MapPin,
                url: "/applications/local",
              },
              {
                id: "international-license",
                titleKey: "sidebar.nav.internationalLicense",
                icon: Globe,
                url: "/applications/international",
              },
            ],
          },
          {
            id: "renew-license",
            titleKey: "sidebar.nav.renewLicense",
            icon: RefreshCw,
            url: "/applications/renew",
          },
          {
            id: "replacement-license",
            titleKey: "sidebar.nav.replacementLicense",
            icon: Replace,
            url: "/applications/replacement",
          },
          {
            id: "release-detained",
            titleKey: "sidebar.nav.releaseDetained",
            icon: Unlock,
            url: "/applications/release-detained",
          },
        ],
      },
      {
        id: "manage-applications",
        titleKey: "sidebar.nav.manageApplications",
        icon: ClipboardList,
        items: [
          {
            id: "local-dl-applications",
            titleKey: "sidebar.nav.localDLApplications",
            icon: MapPin,
            url: "/applications/manage/local",
          },
          {
            id: "international-license-apps",
            titleKey: "sidebar.nav.internationalLicenseApps",
            icon: Globe,
            url: "/applications/manage/international",
          },
        ],
      },
      {
        id: "detain-licenses",
        titleKey: "sidebar.nav.detainLicenses",
        icon: Lock,
        items: [
          {
            id: "detain-license",
            titleKey: "sidebar.nav.detainLicense",
            icon: Lock,
            url: "/applications/detain",
          },
        ],
      },
      {
        id: "application-types",
        titleKey: "sidebar.nav.applicationTypes",
        icon: FileText,
        url: "/admin/applications/types",
      },
      {
        id: "test-types",
        titleKey: "sidebar.nav.testTypes",
        icon: ClipboardCheck,
        url: "/admin/tests/types",
      },
    ],
  },

  // ── People ───────────────────────────────────────────────────────────────
  {
    id: "management",
    titleKey: "sidebar.groups.management",
    items: [
      {
        id: "people",
        titleKey: "sidebar.nav.people",
        icon: Users,
        url: "/people",
      },
      {
        id: "drivers",
        titleKey: "sidebar.nav.drivers",
        icon: Car,
        url: "/drivers",
      },
    ],
  },

  // ── Administration ───────────────────────────────────────────────────────
  {
    id: "admin",
    titleKey: "sidebar.groups.admin",
    items: [
      {
        id: "users",
        titleKey: "sidebar.nav.users",
        icon: ShieldCheck,
        url: "/admin/users",
        roles: ["Admin"],
      },
      {
        id: "account-settings",
        titleKey: "sidebar.nav.accountSettings",
        icon: Settings,
        url: "/account/settings",
      },
    ],
  },
];

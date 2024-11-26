import {AdminRoutes} from "@admin-folder/admin.routes"
import {SettingsRoute} from "@admin-pages/settings/settings.route"
import {Injectable} from "@angular/core"

export interface MenuItemInterface {
  name: string
  url?: string | string[]
  faIcon?: string
  faIconType?: "solid" | "outline"
  children?: {
    name: string
    url?: string | string[]
    faIcon?: string
    faIconType?: "solid" | "outline"
  }[]
  isAdmin?: boolean
}

@Injectable({providedIn: "root"})
export class MenuListService {
  MenuListRecord: MenuItemInterface[] = [
    {
      // 0
      name: "Dashboard",
      url: ["dashboard"],
      faIcon: "fa-tachometer-alt",
    },
    {
      // 1
      name: "Businesses",
      url: [AdminRoutes.businesses],
      faIcon: "fa-building",
    },
    {
      // 2
      name: "Monthly Remittance",
      url: ["schedules"],
      faIcon: "fa-file-invoice",
      children: [
        {
          name: "Employees",
          url: ["employee-schedule"],
          faIcon: "fa-circle",
          faIconType: "outline",
        },
        // {
        //   name: "Deleted Employees",
        //   url: ["deleted-employees"],
        //   faIcon: "fa-circle",
        //   faIconType: "outline",
        // },
        {
          name: "Schedules",
          url: ["schedules"],
          faIcon: "fa-circle",
          faIconType: "outline",
        },
        {
          name: "Assessments",
          url: ["assessments"],
          faIcon: "fa-circle",
          faIconType: "outline",
        },
      ],
    },
    {
      // 3
      name: "Form H3 (Projections)",
      faIcon: "fa-chart-bar",
      children: [
        {
          name: "Upload Form H3",
          url: ["upload-projection"],
          faIcon: "fa-circle",
          faIconType: "outline",
        },
        {
          name: "Filed Form H3",
          url: ["pending-projection"],
          faIcon: "fa-circle",
          faIconType: "outline",
        },
        {
          name: "Projections",
          url: ["approved-projection"],
          faIcon: "fa-circle",
          faIconType: "outline",
        },
      ],
    },
    {
      // 4
      name: "Form H1 (Annual Return)",
      faIcon: "fa-exchange-alt",
      children: [
        {
          name: "Form H1 Filling & Uploads",
          url: ["annual-return-employees-upload"],
          faIcon: "fa-circle",
          faIconType: "outline",
        },
        {
          name: "Form h1 Schedules",
          url: ["annual-return-schedules"],
          faIcon: "fa-circle",
          faIconType: "outline",
        },
        {
          name: "Re-assessed",
          url: ["annual-return-assessments"],
          faIcon: "fa-circle",
          faIconType: "outline",
        },
        {
          name: "Objections",
          url: ["reassessment-appeals"],
          faIcon: "fa-circle",
          faIconType: "outline",
        },
      ],
    },
    {
      // 5
      name: "TCC Application",
      faIcon: "fa-file-invoice",
      children: [
        {
          name: "Pending Application",
          url: [AdminRoutes.pendingApplication],
          faIcon: "fa-folder-open",
        },
        {
          name: "Submitted Application",
          url: [AdminRoutes.submittedApplication],
          faIcon: "fa-folder",
        },
      ],
    },
    {
      // 6
      name: "Reports",
      faIcon: "fa-file-invoice",
      children: [
        {
          name: "Transaction History",
          url: ["reports"],
          faIcon: "fa-chart-bar",
        },
      ],
    },
    {
      // 7
      name: "Admin",
      faIcon: "fa-user",
      children: [
        {
          name: "System Settings",
          url: ["settings", SettingsRoute.systemSettings],
          faIcon: "fa fa-cog",
        },
        {
          name: "Manage Users",
          url: ["settings", SettingsRoute.manageUsers],
          faIcon: "fa fa-users",
        },
      ],
      isAdmin: true,
    },
    {
      // 8
      name: "Logout",
      url: ["/logout"],
      faIcon: "fa-sign-out-alt",
    },
  ]
}

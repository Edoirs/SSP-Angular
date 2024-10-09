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
}


export const MenuListRecord: MenuItemInterface[] = [
  {
    // 0
    name: "Dashboard",
    url: ["/admin", "dashboard"],
    faIcon: "fa-tachometer-alt",
  },
  {
    // 1
    name: "Businesses",
    url: ["/admin", "businesses"],
    faIcon: "fa-building",
  },
  {
    // 2
    name: "Monthly Remittance",
    url: ["/admin", "schedules"],
    faIcon: "fa-file-invoice",
    children: [
      {
        name: "Employees",
        url: ["admin", "employee-schedule"],
        faIcon: "fa-circle",
        faIconType: "outline",
      },
      // {
      //   name: "Deleted Employees",
      //   url: ["admin", "deleted-employees"],
      //   faIcon: "fa-circle",
      //   faIconType: "outline",
      // },
      {
        name: "Schedules",
        url: ["admin", "schedules"],
        faIcon: "fa-circle",
        faIconType: "outline",
      },
      {
        name: "Assessments",
        url: ["admin", "assessments"],
        faIcon: "fa-circle",
        faIconType: "outline",
      },
    ],
  },
  {
    // 3
    name: "Form H1 (Annual Return)",
    faIcon: "fa-exchange-alt",
    children: [
      {
        name: "Form H1 Filling & Uploads",
        url: ["admin", "annual-return-employees-upload"],
        faIcon: "fa-circle",
        faIconType: "outline",
      },
      {
        name: "Form h1 Schedules",
        url: ["admin", "annual-return-schedules"],
        faIcon: "fa-circle",
        faIconType: "outline",
      },
      {
        name: "Re-assessed",
        url: ["admin", "annual-return-assessments"],
        faIcon: "fa-circle",
        faIconType: "outline",
      },
      {
        name: "Objections",
        url: ["admin", "reassessment-appeals"],
        faIcon: "fa-circle",
        faIconType: "outline",
      },
    ],
  },
  {
    // 4
    name: "Form H3 (Projections)",
    faIcon: "fa-chart-bar",
    children: [
      {
        name: "Upload Form H3",
        url: ["admin", "upload-projection"],
        faIcon: "fa-circle",
        faIconType: "outline",
      },
      {
        name: "Filed Form H3",
        url: ["admin", "pending-projection"],
        faIcon: "fa-circle",
        faIconType: "outline",
      },
      {
        name: "Projections",
        url: ["admin", "approved-projection"],
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
        url: ["admin", "pending-application"],
        faIcon: "fa-folder-open",
      },
      {
        name: "Submitted Application",
        url: ["admin", "submitted-application"],
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
        url: ["admin", "reports"],
        faIcon: "fa-chart-bar",
      },
    ],
  },
  {
    // 7
    name: "Logout",
    url: ["/logout"],
    faIcon: "fa-sign-out-alt",
  },
]
import {Routes} from "@angular/router"

export const SettingsRoute = {
  manageUsers: "manage-users",
  systemSettings: "system-settings",
}

export default [
  {
    path: SettingsRoute.manageUsers,
    loadComponent: () =>
      import("./manage-users/manage-users.component").then(
        (c) => c.ManageUsersComponent
      ),
  },
  {
    path: SettingsRoute.systemSettings,
    loadComponent: () =>
      import("./system-settings/system-settings.component").then(
        (c) => c.SystemSettingsComponent
      ),
  },
] as Routes

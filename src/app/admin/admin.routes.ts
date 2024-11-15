import {Routes} from "@angular/router"

export const AdminRoutes = {
  businesses: "businesses",
  pendingApplication: "pending-application",
  submittedApplication: "submitted-application",
}

export default [
  {
    path: "",
    loadChildren: () =>
      import("./features/paye-routes.module").then((m) => m.PayeRoutingModule),
  },
  {
    path: AdminRoutes.businesses,
    loadComponent: () =>
      import("./features/businesses/businesses.component").then(
        (c) => c.BusinessesComponent
      ),
  },
  {
    path: AdminRoutes.pendingApplication,
    loadComponent: () =>
      import(
        "./features/tcc-application/features/pending-application/pending-application.component"
      ).then((c) => c.TccPendingApplicationComponent),
  },
  {
    path: AdminRoutes.submittedApplication,
    loadComponent: () =>
      import(
        "./features/tcc-application/features/submitted-application/submitted-application.component"
      ).then((c) => c.TccSubmittedApplicationComponent),
  },
  {
    path: "settings",
    loadChildren: () => import("./features/settings/settings.route"),
  },
] as Routes

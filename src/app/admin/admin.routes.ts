import {Routes} from "@angular/router"

export default [
  {
    path: "",
    loadChildren: () =>
      import("./features/paye-routes.module").then((m) => m.PayeRoutingModule),
  },
  {
    path: "businesses",
    loadComponent: () =>
      import("./features/businesses/businesses.component").then(
        (c) => c.BusinessesComponent
      ),
  },
  {
    path: "pending-application",
    loadComponent: () =>
      import(
        "./features/tcc-application/features/pending-application/pending-application.component"
      ).then((c) => c.TccPendingApplicationComponent),
  },
  {
    path: "submitted-application",
    loadComponent: () =>
      import(
        "./features/tcc-application/features/submitted-application/submitted-application.component"
      ).then((c) => c.TccSubmittedApplicationComponent),
  },
] as Routes

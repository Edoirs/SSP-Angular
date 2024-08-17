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
] as Routes

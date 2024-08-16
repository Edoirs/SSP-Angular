import {Routes} from "@angular/router"

export default [
  {
    path: "businesses",
    loadComponent: () =>
      import("./features/businesses/businesses.component").then(
        (c) => c.BusinessesComponent
      ),
  },
] as Routes

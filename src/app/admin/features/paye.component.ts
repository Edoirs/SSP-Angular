import {Component} from "@angular/core"

@Component({
  selector: "app-paye-component",
  template: `
    <app-main-header />
    <app-main-sidebar />
    <app-control-sidebar />
    <ngx-ui-loader fgsColor="white" pbColor="grey" />
    <main>
      hello
      <router-outlet></router-outlet>
    </main>
    <app-main-footer />
  `,
})
export class PayeComponent {}

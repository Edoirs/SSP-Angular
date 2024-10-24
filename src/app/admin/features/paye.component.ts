import {Component} from "@angular/core"

@Component({
  selector: "app-paye-component",
  template: `
    <app-main-header />
    <app-main-sidebar />
    <app-control-sidebar />
    <ngx-ui-loader fgsColor="white" pbColor="grey" />
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-main-footer />
  `,
  styles: `
  main{
    padding: 0 0 60px 24px;
  }
  `,
})
export class PayeComponent {}

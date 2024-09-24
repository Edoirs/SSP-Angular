import { Component } from '@angular/core';
import {MenuItemInterface} from "../menu-item/data-access/menu-item.model"

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
})
export class MenuComponent {
  readonly menuList: MenuItemInterface[] = [
    {
      name: "testing",
      url: ["/admin", "schedules"],
      faIcon: "fa-circle",
      children: [
        {name: "dashboard", url: "/admin/dashboard", faIcon: "fa-circle"},
      ],
    },
  ]
}

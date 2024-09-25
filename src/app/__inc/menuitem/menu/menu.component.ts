import { Component } from '@angular/core';
import {
  MenuItemInterface,
  MenuListRecord,
} from "../menu-item/data-access/menu-item.model"

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
})
export class MenuComponent {
  readonly menuList: MenuItemInterface[] = MenuListRecord
}

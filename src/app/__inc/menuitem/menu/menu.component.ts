import {Component, inject} from "@angular/core"
import {
  MenuItemInterface,
  MenuListService,
} from "../menu-item/data-access/menu-item.service"
import {LoginResInterface, TokenService} from "@shared/services/token.service"

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
})
export class MenuComponent {
  readonly user: LoginResInterface = inject(TokenService).getLoginResData
  readonly menuList: MenuItemInterface[] =
    inject(MenuListService).MenuListRecord
}

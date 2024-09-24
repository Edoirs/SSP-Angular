import {
  Component,
  ElementRef,
  inject,
  input,
  Renderer2,
  signal,
  viewChild,
} from "@angular/core"
import {MenuItemInterface} from "./data-access/menu-item.model"
import {NgClass, NgStyle} from "@angular/common"
import {RouterLink, RouterLinkActive} from "@angular/router"

@Component({
  selector: "app-menu-item",
  standalone: true,
  templateUrl: "./menu-item.component.html",
  styleUrl: "./menu-item.component.css",
  imports: [NgClass, NgStyle, RouterLink, RouterLinkActive],
})
export class MenuItemComponent {
  private readonly renderer = inject(Renderer2)
  readonly data = input.required<MenuItemInterface>()
  menuIcon = viewChild<ElementRef<HTMLElement>>("menuIcon")
  subMenu = viewChild<ElementRef<HTMLElement>>("subMenu")
  openMenu = signal(false)

  toggleMenu() {
    this.openMenu.set(!this.openMenu())
  }

  openSubMenu() {
    this.renderer.setStyle(this.subMenu()?.nativeElement, "display", "block")
    this.renderer.setStyle(
      this.menuIcon()?.nativeElement,
      "transform",
      "rotate(90deg)"
    )
  }
}

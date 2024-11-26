import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  Renderer2,
  signal,
  viewChild,
} from "@angular/core"
import {MenuItemInterface} from "./data-access/menu-item.service"
import {NgClass, NgStyle} from "@angular/common"
import {RouterLink, RouterLinkActive} from "@angular/router"
import {MenuItemService} from "../menu.service"

@Component({
  selector: "app-menu-item",
  standalone: true,
  templateUrl: "./menu-item.component.html",
  styleUrl: "./menu-item.component.css",
  imports: [NgClass, NgStyle, RouterLink, RouterLinkActive],
})
export class MenuItemComponent {
  private readonly renderer = inject(Renderer2)
  private readonly menuItemService = inject(MenuItemService)
  readonly data = input.required<MenuItemInterface>()
  readonly menuIndex = input.required<number>()
  menuIcon = viewChild<ElementRef<HTMLElement>>("menuIcon")
  subMenu = viewChild<ElementRef<HTMLElement>>("subMenu")
  openMenu = signal(false)

  selected = signal(false)

  constructor() {
    effect(
      () => {
        if (this.menuItemService.activeIndex()) {
          this.openMenu.set(
            this.menuIndex() === this.menuItemService.activeIndex() &&
              this.menuItemService.selected()
          )
          if (this.openMenu()) {
            this.openMenu()
          } else {
            this.closeSubMenu()
          }
        }
      },
      {allowSignalWrites: true}
    )
  }

  toggleMenu(index: number) {
    this.menuItemService.updateActiveIndex(index)
  }

  openSubMenu() {
    this.renderer.setStyle(this.subMenu()?.nativeElement, "display", "block")
    this.renderer.setStyle(
      this.menuIcon()?.nativeElement,
      "transform",
      "rotate(90deg)"
    )
  }

  closeSubMenu() {
    if (this.subMenu()?.nativeElement) {
      this.renderer.setStyle(this.subMenu()?.nativeElement, "display", "none")
      this.renderer.setStyle(
        this.menuIcon()?.nativeElement,
        "transform",
        "rotate(0deg)"
      )
    }
  }
}

import {Injectable, signal} from "@angular/core"

@Injectable({providedIn: "root"})
export class MenuItemService {
  readonly activeIndex = signal<number>(0)

  set updateActiveIndex(index: number) {
    this.activeIndex.set(index)
  }
}

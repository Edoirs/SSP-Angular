import {NgModule} from "@angular/core"
import {ContentWrapperComponent} from "./content-wrapper/content-wrapper.component"
import {ControlSidebarComponent} from "./control-sidebar/control-sidebar.component"
import {MainFooterComponent} from "./main-footer/main-footer.component"
import {MainHeaderComponent} from "./main-header/main-header.component"
import {MainSidebarComponent} from "./main-sidebar/main-sidebar.component"
import {WebfooterComponent} from "./webfooter/webfooter.component"
import {WebheaderComponent} from "./webheader/webheader.component"
import {WhatsupchatComponent} from "./whatsupchat/whatsupchat.component"
import {MenuComponent} from "./menuitem/menu/menu.component"
import {CommonModule} from "@angular/common"
import {RouterModule} from "@angular/router"
import {MenuItemComponent} from "./menuitem/menu-item/menu-item.component"

@NgModule({
  declarations: [
    ContentWrapperComponent,
    ControlSidebarComponent,
    MainFooterComponent,
    MainHeaderComponent,
    MainSidebarComponent,
    WebfooterComponent,
    WebheaderComponent,
    WhatsupchatComponent,
    MenuComponent,
  ],
  imports: [CommonModule, RouterModule, MenuItemComponent],
  exports: [
    ContentWrapperComponent,
    ControlSidebarComponent,
    MainFooterComponent,
    MainHeaderComponent,
    MainSidebarComponent,
    WebfooterComponent,
    WebheaderComponent,
    WhatsupchatComponent,
  ],
})
export class IncModule {}

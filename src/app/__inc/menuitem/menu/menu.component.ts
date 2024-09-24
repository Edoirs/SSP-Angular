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
      // 0
      name: "Dashboard",
      url: ["/admin", "dashboard"],
      faIcon: "fa-tachometer-alt",
    },
    {
      // 1
      name: "Businesses",
      url: ["/admin", "businesses"],
      faIcon: "fa-building",
    },
    {
      // 2
      name: "Monthly Remittance",
      url: ["/admin", "schedules"],
      faIcon: "fa-file-invoice",
      children: [
        {
          name: "Employees",
          url: ["admin", "employee-schedule"],
          faIcon: "fa-circle",
          faIconType: "outline",
        },
        {
          name: "Deleted Employees",
          url: ["admin", "deleted-employees"],
          faIcon: "fa-circle",
          faIconType: "outline",
        },
        {
          name: "Schedules",
          url: ["admin", "schedules"],
          faIcon: "fa-circle",
          faIconType: "outline",
        },
        {
          name: "Assessments",
          url: ["admin", "assessments"],
          faIcon: "fa-circle",
          faIconType: "outline",
        },
      ],
    },
    {
      // 3
      name: "Form H1 (Annual Return)",
      url: ["/admin", "schedules"],
      faIcon: "fa-file-invoice",
      children: [
        {
          name: "Employees",
          url: ["admin", "employee-schedule"],
          faIcon: "fa-circle",
          faIconType: "outline",
        },
        {
          name: "Deleted Employees",
          url: ["admin", "deleted-employees"],
          faIcon: "fa-circle",
          faIconType: "outline",
        },
        {
          name: "Schedules",
          url: ["admin", "schedules"],
          faIcon: "fa-circle",
          faIconType: "outline",
        },
        {
          name: "Assessments",
          url: ["admin", "assessments"],
          faIcon: "fa-circle",
          faIconType: "outline",
        },
      ],
    },
    {
      name: "testing",
      url: ["/admin", "schedules"],
      faIcon: "fa-circle",
      children: [
        {name: "dashboard", url: "/admin/dashboard", faIcon: "fa-circle"},
      ],
    },
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

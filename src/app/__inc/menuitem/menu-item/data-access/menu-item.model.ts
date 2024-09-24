export interface MenuItemInterface {
  name: string
  url: string | string[]
  faIcon: string
  children?: {name: string; url: string | string[]; faIcon: string}[]
}

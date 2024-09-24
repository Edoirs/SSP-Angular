export interface MenuItemInterface {
  name: string
  url?: string | string[]
  faIcon?: string
  faIconType?: "solid" | "outline"
  children?: {
    name: string
    url?: string | string[]
    faIcon?: string
    faIconType?: "solid" | "outline"
  }[]
}

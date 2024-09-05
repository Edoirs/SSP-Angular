import {MatDialogConfig} from "@angular/material/dialog"
import {MatSnackBarConfig} from "@angular/material/snack-bar"

export const MaterialSnackErrorConfig = (): MatSnackBarConfig => ({
  duration: 3000,
  horizontalPosition: "right",
  verticalPosition: "top",
})

export const MaterialDialogConfig = (data?: any): MatDialogConfig => ({
  data,
  minWidth: 1000,
  maxHeight: 800,
})

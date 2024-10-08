export const SweetAlertOptions = (message?: string, status?: boolean): any => ({
  icon: status ? "success" : "error",
  title: status ? "" : "Oops...",
  text: message,
  showConfirmButton: true,
  timer: 5000,
})

export const SweetAlertInfoOption = (message: string): any => ({
  icon: "info",
  title: "Info",
  text: message,
  showConfirmButton: true,
  timer: 5000,
})

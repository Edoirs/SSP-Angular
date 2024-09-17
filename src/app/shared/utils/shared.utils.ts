import {Observable} from "rxjs/internal/Observable"
import {fromEvent} from "rxjs/internal/observable/fromEvent"
import {debounceTime, distinctUntilChanged, map} from "rxjs/operators"
import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms"


export const ThrotlleQuery = (
  event: HTMLInputElement,
  eventType: string
): Observable<string> => {
  return fromEvent(event, eventType).pipe(
    map((event: any) => event.target.value),
    debounceTime(800),
    distinctUntilChanged()
  )
}

export const ValidYears = (): number[] => {
  let years: number[] = []

  for (let year = 2018; year <= new Date().getFullYear(); year++) {
    years.push(year)
  }

  return years
}

export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  return control.value.password === control.value.password_confirmation
    ? null
    : {PasswordNoMatch: true}
}

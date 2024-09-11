import {Observable} from "rxjs/internal/Observable"
import {fromEvent} from "rxjs/internal/observable/fromEvent"
import {debounceTime, distinctUntilChanged, map} from "rxjs/operators"

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

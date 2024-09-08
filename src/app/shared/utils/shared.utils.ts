import {Observable} from "rxjs/internal/Observable"
import {fromEvent} from "rxjs/internal/observable/fromEvent"
import {debounceTime, distinctUntilChanged, map} from "rxjs/operators"

export const ThrotlleQuery = (
  event: HTMLInputElement,
  type: string
): Observable<string> => {
  return fromEvent(event, type).pipe(
    map((event: any) => event.target.value),
    debounceTime(800),
    distinctUntilChanged()
  )
}

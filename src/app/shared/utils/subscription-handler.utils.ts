import {Subscription} from "rxjs"

export class SubscriptionHandler {
  private readonly subs: Subscription[] = []

  set add(subscription: Subscription) {
    this.subs.push(subscription)
  }

  clear() {
    if (!this.subs.length) return

    return this.subs.forEach((sub) => sub.unsubscribe())
  }
}

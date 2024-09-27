import { MonoTypeOperatorFunction, Subject, delayWhen } from "rxjs";

import { Time } from "./time";

export function delayTime<T>(due: number): MonoTypeOperatorFunction<T> {
  const duration = new Subject<0>();
  Time.time.setTimeout(() => duration.next(0), due);
  return delayWhen(() => duration);
}

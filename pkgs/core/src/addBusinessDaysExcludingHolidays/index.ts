import { addBusinessDays } from "../addBusinessDays/index.ts";
import { constructFrom } from "../constructFrom/index.ts";
import { isWeekend } from "../isWeekend/index.ts";
import { startOfDay } from "../startOfDay/index.ts";
import { toDate } from "../toDate/index.ts";
import type { ContextOptions, DateArg } from "../types.ts";

/**
 * The {@link addBusinessDaysExcludingHolidays} function options.
 */
export interface AddBusinessDaysExcludingHolidaysOptions<
  DateType extends Date = Date,
> extends ContextOptions<DateType> {
  /**
   * Caller-supplied holiday dates matched by calendar day. Weekend holidays
   * are already skipped as weekends. Core does not bundle holiday calendars.
   */
  holidays?: Array<DateArg<Date>>;
}

/**
 * @name addBusinessDaysExcludingHolidays
 * @category Day Helpers
 * @summary Add the specified number of business days, skipping weekends and caller-supplied holidays.
 *
 * @description
 * Add the specified number of business days (Mon–Fri) to the given date,
 * ignoring weekends and any dates in `options.holidays`. Holidays are matched
 * by calendar day. Core holds no holiday calendar data — pass dates from the
 * caller (for example from `date-fns-holiday-us`).
 *
 * If `holidays` is omitted or empty, the result matches {@link addBusinessDays}.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
 *
 * @param date - The date to be changed
 * @param amount - The amount of business days to be added.
 * @param options - An object with options
 *
 * @returns The new date with the business days added
 *
 * @example
 * // Add 1 business day to Friday 10 January 2020, skipping Monday 13 January:
 * const result = addBusinessDaysExcludingHolidays(
 *   new Date(2020, 0, 10),
 *   1,
 *   { holidays: [new Date(2020, 0, 13)] }
 * )
 * //=> Tue Jan 14 2020 00:00:00
 */
export function addBusinessDaysExcludingHolidays<
  DateType extends Date,
  ResultDate extends Date = DateType,
>(
  date: DateArg<DateType>,
  amount: number,
  options?: AddBusinessDaysExcludingHolidaysOptions<ResultDate> | undefined,
): ResultDate {
  const holidays = options?.holidays;
  if (!holidays?.length) {
    return addBusinessDays(date, amount, options);
  }

  const _date = toDate(date, options?.in);
  if (isNaN(amount)) return constructFrom(options?.in, NaN);

  const hours = _date.getHours();
  const sign = amount < 0 ? -1 : 1;
  let remaining = Math.abs(amount);

  const context = { in: options?.in };
  const holidayDays = new Set<number>();
  for (const holiday of holidays) {
    holidayDays.add(+startOfDay(holiday, context));
  }

  while (remaining > 0) {
    _date.setDate(_date.getDate() + sign);
    if (isWeekend(_date, options)) continue;
    if (holidayDays.has(+startOfDay(_date, context))) continue;
    remaining -= 1;
  }

  // Restore hours to avoid DST lag
  _date.setHours(hours);

  return _date;
}

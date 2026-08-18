import { addBusinessDaysExcludingHolidays } from "../addBusinessDaysExcludingHolidays/index.ts";
import type { ContextOptions, DateArg } from "../types.ts";

/**
 * The {@link subBusinessDaysExcludingHolidays} function options.
 */
export interface SubBusinessDaysExcludingHolidaysOptions<
  DateType extends Date = Date,
> extends ContextOptions<DateType> {
  /**
   * Caller-supplied holiday dates matched by calendar day. Weekend holidays
   * are already skipped as weekends. Core does not bundle holiday calendars.
   */
  holidays?: Array<DateArg<Date>>;
}

/**
 * @name subBusinessDaysExcludingHolidays
 * @category Day Helpers
 * @summary Subtract the specified number of business days, skipping weekends and caller-supplied holidays.
 *
 * @description
 * Subtract the specified number of business days (Mon–Fri) from the given date,
 * ignoring weekends and any dates in `options.holidays`. Holidays are matched
 * by calendar day. Core holds no holiday calendar data — pass dates from the
 * caller (for example from `date-fns-holiday-us`).
 *
 * If `holidays` is omitted or empty, the result matches {@link subBusinessDays}.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
 *
 * @param date - The date to be changed
 * @param amount - The amount of business days to be subtracted.
 * @param options - An object with options
 *
 * @returns The new date with the business days subtracted
 *
 * @example
 * // Subtract 1 business day from Tuesday 14 January 2020, skipping Monday 13 January:
 * const result = subBusinessDaysExcludingHolidays(
 *   new Date(2020, 0, 14),
 *   1,
 *   { holidays: [new Date(2020, 0, 13)] }
 * )
 * //=> Fri Jan 10 2020 00:00:00
 */
export function subBusinessDaysExcludingHolidays<
  DateType extends Date,
  ResultDate extends Date = DateType,
>(
  date: DateArg<DateType>,
  amount: number,
  options?: SubBusinessDaysExcludingHolidaysOptions<ResultDate> | undefined,
): ResultDate {
  return addBusinessDaysExcludingHolidays(date, -amount, options);
}

import { addBusinessDaysExcludingHolidays } from "../addBusinessDaysExcludingHolidays/index.ts";
import type { ContextOptions, DateArg } from "../types.ts";

/**
 * The {@link subBusinessDaysExcludingHolidays} function options.
 */
export interface SubBusinessDaysExcludingHolidaysOptions<
  DateType extends Date = Date,
> extends ContextOptions<DateType> {
  /** Dates to treat as non-business days in addition to weekends. */
  holidays?: Array<DateArg<Date>> | undefined;
}

/**
 * @name subBusinessDaysExcludingHolidays
 * @category Day Helpers
 * @summary Subtract the specified number of business days (mon - fri) from the given date, excluding listed holidays.
 *
 * @description
 * Subtract the specified number of business days (mon - fri) from the given date,
 * ignoring weekends and caller-supplied holidays.
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
 * // Subtract 3 business days from 8 September 2014, excluding 4 September:
 * const result = subBusinessDaysExcludingHolidays(new Date(2014, 8, 8), 3, {
 *   holidays: [new Date(2014, 8, 4)],
 * })
 * //=> Tue Sep 02 2014 00:00:00 (skipped Thu Sep 04 holiday)
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

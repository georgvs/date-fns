import { addBusinessDays } from "../addBusinessDays/index.ts";
import { constructFrom } from "../constructFrom/index.ts";
import { isSameDay } from "../isSameDay/index.ts";
import { isWeekend } from "../isWeekend/index.ts";
import { toDate } from "../toDate/index.ts";
import type { ContextOptions, DateArg } from "../types.ts";

/**
 * The {@link addBusinessDaysExcludingHolidays} function options.
 */
export interface AddBusinessDaysExcludingHolidaysOptions<
  DateType extends Date = Date,
> extends ContextOptions<DateType> {
  /** Dates to treat as non-business days in addition to weekends. */
  holidays?: Array<DateArg<Date>> | undefined;
}

/**
 * @name addBusinessDaysExcludingHolidays
 * @category Day Helpers
 * @summary Add the specified number of business days (mon - fri) to the given date, excluding listed holidays.
 *
 * @description
 * Add the specified number of business days (mon - fri) to the given date,
 * ignoring weekends and caller-supplied holidays.
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
 * // Add 3 business days to 1 September 2014, excluding 4 September:
 * const result = addBusinessDaysExcludingHolidays(new Date(2014, 8, 1), 3, {
 *   holidays: [new Date(2014, 8, 4)],
 * })
 * //=> Fri Sep 05 2014 00:00:00 (skipped Thu Sep 04 holiday)
 */
export function addBusinessDaysExcludingHolidays<
  DateType extends Date,
  ResultDate extends Date = DateType,
>(
  date: DateArg<DateType>,
  amount: number,
  options?: AddBusinessDaysExcludingHolidaysOptions<ResultDate> | undefined,
): ResultDate {
  if (isNaN(amount)) return constructFrom(options?.in, NaN);
  if (!options?.holidays?.length) return addBusinessDays(date, amount, options);

  const _date = toDate(date, options?.in);
  const holidays = options.holidays;
  const hours = _date.getHours();
  const sign = amount < 0 ? -1 : 1;
  let restDays = Math.abs(amount);

  while (restDays > 0) {
    _date.setDate(_date.getDate() + sign);
    if (
      !isWeekend(_date, options) &&
      !holidays.some((holiday) => isSameDay(_date, holiday, options))
    ) {
      restDays -= 1;
    }
  }

  // Restore hours to avoid DST lag
  _date.setHours(hours);
  return _date;
}

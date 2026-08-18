import { TZDate, tz } from "@date-fns/tz";
import { UTCDate } from "@date-fns/utc";
import { describe, expect, it } from "vitest";
import { assertType } from "../_lib/test/index.ts";
import { subBusinessDaysExcludingHolidays } from "./index.ts";

describe("subBusinessDaysExcludingHolidays", () => {
  it("subtracts the given number of business days excluding holidays", () => {
    const result = subBusinessDaysExcludingHolidays(
      new Date(2014, 8 /* Sep */, 8),
      3,
      { holidays: [new Date(2014, 8 /* Sep */, 4)] },
    );
    expect(result).toEqual(new Date(2014, 8 /* Sep */, 2));
  });

  it("handles negative amount", () => {
    const result = subBusinessDaysExcludingHolidays(
      new Date(2014, 8 /* Sep */, 2),
      -3,
      { holidays: [new Date(2014, 8 /* Sep */, 4)] },
    );
    expect(result).toEqual(new Date(2014, 8 /* Sep */, 8));
  });

  it("does not mutate the original date", () => {
    const date = new Date(2014, 8 /* Sep */, 8);
    subBusinessDaysExcludingHolidays(date, 3, {
      holidays: [new Date(2014, 8 /* Sep */, 4)],
    });
    expect(date).toEqual(new Date(2014, 8 /* Sep */, 8));
  });

  it("returns `Invalid Date` if the given date is invalid", () => {
    const result = subBusinessDaysExcludingHolidays(new Date(NaN), 2, {
      holidays: [new Date(2014, 8 /* Sep */, 4)],
    });
    expect(result instanceof Date && isNaN(result.getTime())).toBe(true);
  });

  it("returns `Invalid Date` if the given amount is NaN", () => {
    const result = subBusinessDaysExcludingHolidays(
      new Date(2014, 8 /* Sep */, 8),
      NaN,
      { holidays: [new Date(2014, 8 /* Sep */, 4)] },
    );
    expect(result instanceof Date && isNaN(result.getTime())).toBe(true);
  });

  it("returns `Invalid Date` if the given amount is Infinity", () => {
    const result = subBusinessDaysExcludingHolidays(
      new Date(2014, 8 /* Sep */, 8),
      Infinity,
      { holidays: [new Date(2014, 8 /* Sep */, 4)] },
    );
    expect(result instanceof Date && isNaN(result.getTime())).toBe(true);
  });

  it("returns `Invalid Date` if the given amount is -Infinity", () => {
    const result = subBusinessDaysExcludingHolidays(
      new Date(2014, 8 /* Sep */, 8),
      -Infinity,
      { holidays: [new Date(2014, 8 /* Sep */, 4)] },
    );
    expect(result instanceof Date && isNaN(result.getTime())).toBe(true);
  });

  it("resolves the date type by default", () => {
    const result = subBusinessDaysExcludingHolidays(Date.now(), 5);
    expect(result).toBeInstanceOf(Date);
    assertType<assertType.Equal<Date, typeof result>>(true);
  });

  it("resolves the argument type if a date extension is passed", () => {
    const result = subBusinessDaysExcludingHolidays(new UTCDate(), 5);
    expect(result).toBeInstanceOf(UTCDate);
    assertType<assertType.Equal<UTCDate, typeof result>>(true);
  });

  describe("context", () => {
    it("allows to specify the context", () => {
      expect(
        subBusinessDaysExcludingHolidays("2024-08-20T16:00:00Z", 3, {
          in: tz("Asia/Singapore"),
          holidays: [new Date("2024-08-15T12:00:00Z")],
        }).toISOString(),
      ).toBe("2024-08-16T00:00:00.000+08:00");
    });

    it("resolves the context date type", () => {
      const date = new Date("2014-09-08T00:00:00Z");
      const result = subBusinessDaysExcludingHolidays(date, 1, {
        in: tz("Asia/Tokyo"),
        holidays: [new Date("2014-09-05T00:00:00Z")],
      });
      expect(result).toBeInstanceOf(TZDate);
      assertType<assertType.Equal<TZDate, typeof result>>(true);
    });
  });
});

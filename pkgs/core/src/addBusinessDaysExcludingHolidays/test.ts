import { TZDate, tz } from "@date-fns/tz";
import { UTCDate } from "@date-fns/utc";
import { describe, expect, it } from "vitest";
import { assertType } from "../_lib/test/index.ts";
import { addBusinessDays } from "../addBusinessDays/index.ts";
import { addBusinessDaysExcludingHolidays } from "./index.ts";

describe("addBusinessDaysExcludingHolidays", () => {
  it("adds the given number of business days excluding holidays", () => {
    const result = addBusinessDaysExcludingHolidays(
      new Date(2014, 8 /* Sep */, 1),
      3,
      { holidays: [new Date(2014, 8 /* Sep */, 4)] },
    );
    expect(result).toEqual(new Date(2014, 8 /* Sep */, 5));
  });

  it("handles negative amount", () => {
    const result = addBusinessDaysExcludingHolidays(
      new Date(2014, 8 /* Sep */, 8),
      -3,
      { holidays: [new Date(2014, 8 /* Sep */, 4)] },
    );
    expect(result).toEqual(new Date(2014, 8 /* Sep */, 2));
  });

  it("returns Tuesday when Monday is a holiday and adding 1 day on Friday", () => {
    expect(
      addBusinessDaysExcludingHolidays(new Date(2020, 0 /* Jan */, 10), 1, {
        holidays: [new Date(2020, 0 /* Jan */, 13)],
      }),
    ).toEqual(new Date(2020, 0 /* Jan */, 14));
  });

  it("returns the correct date when starting on Saturday", () => {
    expect(
      addBusinessDaysExcludingHolidays(new Date(2020, 0 /* Jan */, 11), 1, {
        holidays: [new Date(2020, 0 /* Jan */, 13)],
      }),
    ).toEqual(new Date(2020, 0 /* Jan */, 14));
  });

  it("returns the correct date when starting on Sunday", () => {
    expect(
      addBusinessDaysExcludingHolidays(new Date(2020, 0 /* Jan */, 12), 1, {
        holidays: [new Date(2020, 0 /* Jan */, 13)],
      }),
    ).toEqual(new Date(2020, 0 /* Jan */, 14));
  });

  it("ignores holidays that fall on a weekend", () => {
    const result = addBusinessDaysExcludingHolidays(
      new Date(2020, 0 /* Jan */, 10),
      1,
      { holidays: [new Date(2020, 0 /* Jan */, 11)] },
    );
    expect(result).toEqual(new Date(2020, 0 /* Jan */, 13));
  });

  it("falls back to addBusinessDays when holidays are omitted", () => {
    const date = new Date(2014, 8 /* Sep */, 1);
    const amount = 10;
    expect(addBusinessDaysExcludingHolidays(date, amount)).toEqual(
      addBusinessDays(date, amount),
    );
  });

  it("falls back to addBusinessDays when holidays are empty", () => {
    const date = new Date(2014, 8 /* Sep */, 1);
    const amount = 10;
    expect(
      addBusinessDaysExcludingHolidays(date, amount, { holidays: [] }),
    ).toEqual(addBusinessDays(date, amount));
  });

  it("matches holidays by calendar day", () => {
    const result = addBusinessDaysExcludingHolidays(
      new Date("2014-09-01T10:00:00Z"),
      3,
      {
        in: tz("UTC"),
        holidays: [new Date("2014-09-04T23:59:59Z")],
      },
    );
    expect(result).toEqual(new Date("2014-09-05T10:00:00Z"));
  });

  it("does not mutate the original date", () => {
    const date = new Date(2014, 8 /* Sep */, 1);
    addBusinessDaysExcludingHolidays(date, 3, {
      holidays: [new Date(2014, 8 /* Sep */, 4)],
    });
    expect(date).toEqual(new Date(2014, 8 /* Sep */, 1));
  });

  it("returns `Invalid Date` if the given date is invalid", () => {
    const result = addBusinessDaysExcludingHolidays(new Date(NaN), 2, {
      holidays: [new Date(2014, 8 /* Sep */, 4)],
    });
    expect(result instanceof Date && isNaN(result.getTime())).toBe(true);
  });

  it("returns `Invalid Date` if the given amount is NaN", () => {
    const result = addBusinessDaysExcludingHolidays(
      new Date(2014, 8 /* Sep */, 1),
      NaN,
      { holidays: [new Date(2014, 8 /* Sep */, 4)] },
    );
    expect(result instanceof Date && isNaN(result.getTime())).toBe(true);
  });

  it("returns `Invalid Date` if the given amount is Infinity", () => {
    const result = addBusinessDaysExcludingHolidays(
      new Date(2014, 8 /* Sep */, 1),
      Infinity,
      { holidays: [new Date(2014, 8 /* Sep */, 4)] },
    );
    expect(result instanceof Date && isNaN(result.getTime())).toBe(true);
  });

  it("returns `Invalid Date` if the given amount is -Infinity", () => {
    const result = addBusinessDaysExcludingHolidays(
      new Date(2014, 8 /* Sep */, 1),
      -Infinity,
      { holidays: [new Date(2014, 8 /* Sep */, 4)] },
    );
    expect(result instanceof Date && isNaN(result.getTime())).toBe(true);
  });

  it("can handle a large number of business days without holidays", () => {
    const result = addBusinessDaysExcludingHolidays(
      new Date(2014, 0 /* Jan */, 1),
      3387885,
    );
    expect(result).toEqual(new Date(15000, 0 /* Jan */, 1));
  });

  it("resolves the date type by default", () => {
    const result = addBusinessDaysExcludingHolidays(Date.now(), 5);
    expect(result).toBeInstanceOf(Date);
    assertType<assertType.Equal<Date, typeof result>>(true);
  });

  it("resolves the argument type if a date extension is passed", () => {
    const result = addBusinessDaysExcludingHolidays(new UTCDate(), 5);
    expect(result).toBeInstanceOf(UTCDate);
    assertType<assertType.Equal<UTCDate, typeof result>>(true);
  });

  describe("context", () => {
    it("allows to specify the context", () => {
      expect(
        addBusinessDaysExcludingHolidays("2024-08-20T16:00:00Z", 3, {
          in: tz("Asia/Singapore"),
          holidays: [new Date("2024-08-22T12:00:00Z")],
        }).toISOString(),
      ).toBe("2024-08-27T00:00:00.000+08:00");
    });

    it("resolves the context date type", () => {
      const date = new Date("2014-09-01T00:00:00Z");
      const result = addBusinessDaysExcludingHolidays(date, 1, {
        in: tz("Asia/Tokyo"),
        holidays: [new Date("2014-09-02T00:00:00Z")],
      });
      expect(result).toBeInstanceOf(TZDate);
      assertType<assertType.Equal<TZDate, typeof result>>(true);
    });
  });
});

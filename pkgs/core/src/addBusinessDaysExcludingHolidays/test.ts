import { TZDate, tz } from "@date-fns/tz";
import { UTCDate } from "@date-fns/utc";
import { describe, expect, it } from "vitest";
import { addBusinessDays } from "../addBusinessDays/index.ts";
import { assertType } from "../_lib/test/index.ts";
import { addBusinessDaysExcludingHolidays } from "./index.ts";

describe("addBusinessDaysExcludingHolidays", () => {
  it("matches addBusinessDays when holidays are omitted", () => {
    expect(
      addBusinessDaysExcludingHolidays(new Date(2020, 0 /* Jan */, 10), 1),
    ).toEqual(addBusinessDays(new Date(2020, 0 /* Jan */, 10), 1));
    expect(
      addBusinessDaysExcludingHolidays(new Date(2020, 0 /* Jan */, 10), 1),
    ).toEqual(new Date(2020, 0 /* Jan */, 13));
  });

  it("matches addBusinessDays when holidays is empty", () => {
    expect(
      addBusinessDaysExcludingHolidays(new Date(2020, 0 /* Jan */, 10), 1, {
        holidays: [],
      }),
    ).toEqual(new Date(2020, 0 /* Jan */, 13));
  });

  it("skips a weekday holiday", () => {
    const result = addBusinessDaysExcludingHolidays(
      new Date(2020, 0 /* Jan */, 10),
      1,
      { holidays: [new Date(2020, 0 /* Jan */, 13)] },
    );
    expect(result).toEqual(new Date(2020, 0 /* Jan */, 14));
  });

  it("does not extra-skip a holiday that falls on Saturday", () => {
    expect(
      addBusinessDaysExcludingHolidays(new Date(2020, 0 /* Jan */, 10), 1, {
        holidays: [new Date(2020, 0 /* Jan */, 11)],
      }),
    ).toEqual(new Date(2020, 0 /* Jan */, 13));
  });

  it("does not extra-skip a holiday that falls on Sunday", () => {
    expect(
      addBusinessDaysExcludingHolidays(new Date(2020, 0 /* Jan */, 10), 1, {
        holidays: [new Date(2020, 0 /* Jan */, 12)],
      }),
    ).toEqual(new Date(2020, 0 /* Jan */, 13));
  });

  it("skips consecutive weekday holidays", () => {
    const result = addBusinessDaysExcludingHolidays(
      new Date(2020, 0 /* Jan */, 10),
      1,
      {
        holidays: [
          new Date(2020, 0 /* Jan */, 13),
          new Date(2020, 0 /* Jan */, 14),
        ],
      },
    );
    expect(result).toEqual(new Date(2020, 0 /* Jan */, 15));
  });

  it("matches holidays by calendar day, not exact timestamp", () => {
    const result = addBusinessDaysExcludingHolidays(
      new Date(2020, 0 /* Jan */, 10),
      1,
      { holidays: [new Date(2020, 0 /* Jan */, 13, 15, 30)] },
    );
    expect(result).toEqual(new Date(2020, 0 /* Jan */, 14));
  });

  it("handles negative amount", () => {
    const result = addBusinessDaysExcludingHolidays(
      new Date(2020, 0 /* Jan */, 14),
      -1,
      { holidays: [new Date(2020, 0 /* Jan */, 13)] },
    );
    expect(result).toEqual(new Date(2020, 0 /* Jan */, 10));
  });

  it("accepts a timestamp", () => {
    const result = addBusinessDaysExcludingHolidays(
      new Date(2020, 0 /* Jan */, 10).getTime(),
      1,
      { holidays: [new Date(2020, 0 /* Jan */, 13)] },
    );
    expect(result).toEqual(new Date(2020, 0 /* Jan */, 14));
  });

  it("does not mutate the original date", () => {
    const date = new Date(2020, 0 /* Jan */, 10);
    addBusinessDaysExcludingHolidays(date, 1, {
      holidays: [new Date(2020, 0 /* Jan */, 13)],
    });
    expect(date).toEqual(new Date(2020, 0 /* Jan */, 10));
  });

  it("returns `Invalid Date` if the given date is invalid", () => {
    const result = addBusinessDaysExcludingHolidays(new Date(NaN), 10, {
      holidays: [new Date(2020, 0 /* Jan */, 13)],
    });
    expect(result instanceof Date && isNaN(result.getTime())).toBe(true);
  });

  it("returns `Invalid Date` if the given amount is NaN", () => {
    const result = addBusinessDaysExcludingHolidays(
      new Date(2020, 0 /* Jan */, 10),
      NaN,
      { holidays: [new Date(2020, 0 /* Jan */, 13)] },
    );
    expect(result instanceof Date && isNaN(result.getTime())).toBe(true);
  });

  it("resolves the date type by default", () => {
    const result = addBusinessDaysExcludingHolidays(Date.now(), 5, {
      holidays: [new Date(2020, 0 /* Jan */, 13)],
    });
    expect(result).toBeInstanceOf(Date);
    assertType<assertType.Equal<Date, typeof result>>(true);
  });

  it("resolves the argument type if a date extension is passed", () => {
    const result = addBusinessDaysExcludingHolidays(new UTCDate(), 5, {
      holidays: [new Date(2020, 0 /* Jan */, 13)],
    });
    expect(result).toBeInstanceOf(UTCDate);
    assertType<assertType.Equal<UTCDate, typeof result>>(true);
  });

  describe("context", () => {
    it("allows to specify the context", () => {
      expect(
        addBusinessDaysExcludingHolidays("2020-01-10T00:00:00Z", 1, {
          in: tz("UTC"),
          holidays: [new Date("2020-01-13T00:00:00Z")],
        }).toISOString(),
      ).toBe("2020-01-14T00:00:00.000+00:00");
    });

    it("resolves the context date type", () => {
      const date = new Date("2020-01-10T00:00:00Z");
      const result = addBusinessDaysExcludingHolidays(date, 1, {
        in: tz("Asia/Tokyo"),
        holidays: [new Date("2020-01-13T00:00:00Z")],
      });
      expect(result).toBeInstanceOf(TZDate);
      assertType<assertType.Equal<TZDate, typeof result>>(true);
    });
  });
});

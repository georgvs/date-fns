import { describe, expect, it } from "vitest";
import { subBusinessDaysExcludingHolidays } from "./index.ts";

describe("subBusinessDaysExcludingHolidays", () => {
  it("subtracts business days skipping a weekday holiday", () => {
    const result = subBusinessDaysExcludingHolidays(
      new Date(2020, 0 /* Jan */, 14),
      1,
      { holidays: [new Date(2020, 0 /* Jan */, 13)] },
    );
    expect(result).toEqual(new Date(2020, 0 /* Jan */, 10));
  });

  it("does not mutate the original date", () => {
    const date = new Date(2020, 0 /* Jan */, 14);
    subBusinessDaysExcludingHolidays(date, 1, {
      holidays: [new Date(2020, 0 /* Jan */, 13)],
    });
    expect(date).toEqual(new Date(2020, 0 /* Jan */, 14));
  });
});

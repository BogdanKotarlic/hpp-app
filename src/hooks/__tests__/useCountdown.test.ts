import { useCountdown } from "../useCountdown";
import { renderHook, act } from "@testing-library/react";

describe("useCountdown", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-01-01T12:00:00Z")); // fixed time
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("formats remaining time correctly", () => {
    const future = Date.now() + 65_000; // 1 min 5 sec in future
    const { result } = renderHook(() => useCountdown(future));

    expect(result.current.formatted).toBe("00:01:05");
    expect(result.current.hasExpired).toBe(false);
  });

  it("counts down and expires correctly", () => {
    const future = Date.now() + 2_000;
    const { result } = renderHook(() => useCountdown(future));

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.secondsLeft).toBe(0);
    expect(result.current.hasExpired).toBe(true);
    expect(result.current.formatted).toBe("00:00:00");
  });

  it("handles undefined timestamp", () => {
    const { result } = renderHook(() => useCountdown(undefined));
    expect(result.current.formatted).toBe("00:00:00");
    expect(result.current.secondsLeft).toBe(0);
    expect(result.current.hasExpired).toBe(true);
  });
});

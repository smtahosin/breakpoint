import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateSolarTelemetry } from '../src/lib/solar-engine';

describe('BreakPoint Solar Engine — NOAA Mathematical ephemeris', () => {
  it('handles equator near solar noon on vernal equinox', () => {
    // 2026-03-20 at 12:07 UTC at (0.0, 0.0)
    const equinoxNoon = new Date('2026-03-20T12:07:00Z');
    const telemetry = calculateSolarTelemetry(0.0, 0.0, equinoxNoon);

    assert.ok(telemetry.elevation > 85, `Elevation ${telemetry.elevation}° should be > 85° near equinox noon`);
    assert.equal(telemetry.isDaylight, true);
    assert.equal(telemetry.twilightState, 'day');
    assert.ok(telemetry.estimatedLux > 80000, `Lux ${telemetry.estimatedLux} should be > 80,000 for overhead clear sun`);
    assert.ok(telemetry.luxLabel.includes('(est.)'), 'Lux must be honestly labeled as estimated');
  });

  it('calculates London summer solstice solar elevation correctly', () => {
    // London: 51.5074° N, 0.1278° W. June 21 12:00 UTC (near solar noon)
    // Theoretical max elevation is approx 90 - 51.5 + 23.44 = 61.9°
    const londonSolstice = new Date('2026-06-21T12:00:00Z');
    const telemetry = calculateSolarTelemetry(51.5074, -0.1278, londonSolstice);

    assert.ok(
      telemetry.elevation >= 60 && telemetry.elevation <= 64,
      `London solstice elevation ${telemetry.elevation}° should be within [60°, 64°]`
    );
    assert.equal(telemetry.isDaylight, true);
    assert.equal(telemetry.twilightState, 'day');
  });

  it('calculates Southern Hemisphere (Sydney) winter noon correctly', () => {
    // Sydney: -33.8688° S, 151.2093° E. June 21 (Winter in South)
    // Solar noon in Sydney is around 02:00 UTC
    const sydneyWinterNoon = new Date('2026-06-21T01:55:00Z');
    const telemetry = calculateSolarTelemetry(-33.8688, 151.2093, sydneyWinterNoon);

    // Max elevation in Sydney winter = 90 - 33.87 - 23.44 = ~32.7°
    assert.ok(
      telemetry.elevation >= 30 && telemetry.elevation <= 35,
      `Sydney winter elevation ${telemetry.elevation}° should be within [30°, 35°]`
    );
    assert.equal(telemetry.isDaylight, true);
    // In Southern hemisphere at solar noon, sun is to the North (azimuth ~ 0° or 360°)
    assert.ok(
      telemetry.azimuth <= 20 || telemetry.azimuth >= 340,
      `Sydney noon sun should face north, got azimuth ${telemetry.azimuth}°`
    );
  });

  it('handles Arctic Circle / Tromsø Polar Night in December', () => {
    // Tromsø: 69.6492° N, 18.9553° E. December 21 at local noon (~10:45 UTC)
    // Sun is below horizon 24/7 (polar night)
    const tromsoWinter = new Date('2026-12-21T10:45:00Z');
    const telemetry = calculateSolarTelemetry(69.6492, 18.9553, tromsoWinter);

    assert.ok(telemetry.elevation < 0, `Polar night elevation ${telemetry.elevation}° must be below horizon`);
    assert.equal(telemetry.isDaylight, false);
    assert.ok(telemetry.estimatedLux < 500, 'Polar night illuminance must be twilight/night level');
  });

  it('handles Arctic Circle / Tromsø Midnight Sun in June', () => {
    // Tromsø: 69.6492° N, 18.9553° E. June 21 at local midnight (~22:45 UTC)
    // Sun stays above horizon even at midnight
    const tromsoSummerMidnight = new Date('2026-06-21T22:45:00Z');
    const telemetry = calculateSolarTelemetry(69.6492, 18.9553, tromsoSummerMidnight);

    assert.ok(telemetry.elevation > -0.833, `Midnight sun elevation ${telemetry.elevation}° should be above horizon`);
    assert.equal(telemetry.isDaylight, true);
  });

  it('classifies twilight and night states accurately with honest lux labels', () => {
    // Test nighttime (e.g. London at 00:00 UTC in winter)
    const londonNight = new Date('2026-01-15T00:00:00Z');
    const nightTelemetry = calculateSolarTelemetry(51.5074, -0.1278, londonNight);

    assert.equal(nightTelemetry.isDaylight, false);
    assert.equal(nightTelemetry.twilightState, 'night');
    assert.equal(nightTelemetry.estimatedLux, 0);
    assert.equal(nightTelemetry.luxLabel, '< 0.1 lux (night)');
  });

  it('safely clamps out-of-range coordinates without throwing or NaN', () => {
    const invalidCoords = calculateSolarTelemetry(999, -999, new Date('2026-05-01T12:00:00Z'));
    assert.equal(invalidCoords.latitude, 90);
    assert.equal(invalidCoords.longitude, -180);
    assert.ok(!isNaN(invalidCoords.elevation));
    assert.ok(!isNaN(invalidCoords.azimuth));
    assert.ok(!isNaN(invalidCoords.estimatedLux));
  });

  it('safely handles invalid Date instances without NaN crash', () => {
    const invalidDate = new Date('invalid-date-string');
    const telemetry = calculateSolarTelemetry(23.8103, 90.4125, invalidDate);
    assert.ok(!isNaN(telemetry.elevation));
    assert.ok(!isNaN(telemetry.azimuth));
    assert.ok(!isNaN(telemetry.estimatedLux));
  });

  it('enforces optical and physical safety in returned advice', () => {
    const day = calculateSolarTelemetry(23.8103, 90.4125, new Date('2026-04-15T06:00:00Z'));
    assert.ok(day.opticalAdvice.includes('Do NOT look directly at the sun'));
    assert.ok(day.opticalAdvice.includes('safe pedestrian route'));

    const night = calculateSolarTelemetry(23.8103, 90.4125, new Date('2026-04-15T18:00:00Z'));
    assert.ok(night.opticalAdvice.includes('safe, well-lit pedestrian route'));
  });

  describe('Independent Astronomical Regression Fixtures', () => {
    it('matches NREL Solar Position Algorithm (SPA) benchmark (Reda & Andreas 2004)', () => {
      // Reference: National Renewable Energy Laboratory (NREL) Technical Report NREL/TP-560-34302, Table A.1
      // Location: Golden, Colorado (Lat: 39.742476° N, Lon: -105.178600° W)
      // Timestamp: 2003-10-17 12:30:30 MST -> 2003-10-17T19:30:30Z
      // Independent SPA Benchmark Values:
      //   Zenith: 50.11162° -> Elevation: 39.88838°
      //   Azimuth (from North): 194.34024°
      const timestamp = new Date('2003-10-17T19:30:30Z');
      const telemetry = calculateSolarTelemetry(39.742476, -105.1786, timestamp);

      // Verify elevation matches NREL benchmark within 0.5° tolerance
      assert.ok(
        Math.abs(telemetry.elevation - 39.888) <= 0.5,
        `Expected elevation ~39.89° ± 0.5°, received ${telemetry.elevation}°`
      );
      // Verify azimuth matches NREL benchmark within 1.0° tolerance
      assert.ok(
        Math.abs(telemetry.azimuth - 194.34) <= 1.0,
        `Expected azimuth ~194.34° ± 1.0°, received ${telemetry.azimuth}°`
      );
      assert.equal(telemetry.isDaylight, true);
      assert.equal(telemetry.twilightState, 'day');
    });

    it('matches Jean Meeus (Astronomical Algorithms 1998 Ch. 25) meridian transit benchmark', () => {
      // Reference: Jean Meeus, Astronomical Algorithms (2nd Ed. 1998), Chapter 25 (Solar Coordinates), Example 25.a
      // Location: Equator / Prime Meridian (0.0000° N, 0.0000° E)
      // Timestamp: 1992-10-13 11:46:17 UTC (solar transit with Equation of Time +13m 42.6s)
      // Independent Astronomical Reference Values:
      //   Apparent Declination: -7° 47' 06" (-7.785°)
      //   Theoretical Equator Elevation: 90° - 7.785° = 82.215° (~82.2°)
      //   Azimuth at meridian transit: 180.0° (due South)
      const timestamp = new Date('1992-10-13T11:46:17Z');
      const telemetry = calculateSolarTelemetry(0.0, 0.0, timestamp);

      assert.ok(
        Math.abs(telemetry.elevation - 82.2) <= 0.5,
        `Expected elevation ~82.2° ± 0.5°, received ${telemetry.elevation}°`
      );
      assert.ok(
        Math.abs(telemetry.azimuth - 180.0) <= 1.0,
        `Expected azimuth ~180.0° ± 1.0°, received ${telemetry.azimuth}°`
      );
      assert.equal(telemetry.isDaylight, true);
    });

    it('matches NOAA Global Monitoring Laboratory solstice benchmark (Boulder, CO)', () => {
      // Reference: NOAA ESRL/GML Solar Calculator (Spencer 1971 / Meeus 1998)
      // Location: Boulder Atmospheric Observatory (40.0500° N, -105.0000° W)
      // Timestamp: 2020-06-21 19:00:00 UTC (12:00 MST, near summer solstice solar noon)
      // Independent Reference Values:
      //   Max summer elevation: 90° - 40.05° + 23.44° = 73.39° (apparent ~73.4°)
      //   Azimuth near solar noon: 178° - 180° (due South)
      const timestamp = new Date('2020-06-21T19:00:00Z');
      const telemetry = calculateSolarTelemetry(40.05, -105.0, timestamp);

      assert.ok(
        Math.abs(telemetry.elevation - 73.4) <= 0.6,
        `Expected elevation ~73.4° ± 0.6°, received ${telemetry.elevation}°`
      );
      assert.ok(
        telemetry.azimuth >= 176 && telemetry.azimuth <= 180,
        `Expected azimuth [176°, 180°], received ${telemetry.azimuth}°`
      );
      assert.equal(telemetry.isDaylight, true);
    });

    it('matches US Naval Observatory high-latitude winter solstice skim (Fairbanks, AK)', () => {
      // Reference: US Naval Observatory Astronomical Applications Dept. / Astronomical Almanac
      // Location: Fairbanks, Alaska (64.8378° N, -147.7164° W)
      // Timestamp: 2024-12-21 21:53:00 UTC (winter solstice local solar noon)
      // Independent Reference Values:
      //   Geometric elevation: 90° - 64.8378° - 23.44° = 1.72°
      //   Atmospheric refraction correction: ~ +0.28° -> Apparent elevation ~ 2.0°
      //   Azimuth at noon: 180° - 181° (due South)
      const timestamp = new Date('2024-12-21T21:53:00Z');
      const telemetry = calculateSolarTelemetry(64.8378, -147.7164, timestamp);

      assert.ok(
        Math.abs(telemetry.elevation - 2.0) <= 0.5,
        `Expected skim elevation ~2.0° ± 0.5°, received ${telemetry.elevation}°`
      );
      assert.ok(
        telemetry.azimuth >= 179 && telemetry.azimuth <= 183,
        `Expected south azimuth [179°, 183°], received ${telemetry.azimuth}°`
      );
      assert.equal(telemetry.isDaylight, true);
    });

    it('matches equinox exact cardinal sunrise (90° E) and sunset (270° W) at equator', () => {
      // Reference: Fundamental Celestial Mechanics (Astronomical Coordinate Invariants)
      // Location: Equator / Prime Meridian (0.0000° N, 0.0000° E)
      // Timestamp: 2024-03-20 06:07:30 UTC (sunrise) and 2024-03-20 18:07:30 UTC (sunset)
      // Invariant Values:
      //   Sunrise azimuth must be precisely 90.0° (due East)
      //   Sunset azimuth must be precisely 270.0° (due West)
      //   Elevation near horizon contact: between 0.0° and 1.0° (with refraction)
      const sunrise = calculateSolarTelemetry(0.0, 0.0, new Date('2024-03-20T06:07:30Z'));
      const sunset = calculateSolarTelemetry(0.0, 0.0, new Date('2024-03-20T18:07:30Z'));

      assert.ok(
        Math.abs(sunrise.azimuth - 90.0) <= 1.0,
        `Expected sunrise azimuth 90.0° ± 1.0°, received ${sunrise.azimuth}°`
      );
      assert.ok(
        Math.abs(sunset.azimuth - 270.0) <= 1.0,
        `Expected sunset azimuth 270.0° ± 1.0°, received ${sunset.azimuth}°`
      );
      assert.ok(
        sunrise.elevation >= 0.0 && sunrise.elevation <= 1.0,
        `Expected sunrise elevation [0.0°, 1.0°], received ${sunrise.elevation}°`
      );
      assert.ok(
        sunset.elevation >= 0.0 && sunset.elevation <= 1.0,
        `Expected sunset elevation [0.0°, 1.0°], received ${sunset.elevation}°`
      );
    });
  });
});

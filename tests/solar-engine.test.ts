import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateSolarTelemetry } from '../src/lib/solar-engine.ts';

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
});

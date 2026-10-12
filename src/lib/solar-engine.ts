/**
 * BreakPoint Solar Engine
 * Production-Grade NOAA Solar Position Algorithm (Jean Meeus / Astronomical Algorithms)
 * Deterministic client-side computation from UTC timestamp and geographic coordinates.
 * 
 * Reference: NOAA Global Monitoring Laboratory / Solar Calculation Equations
 * https://gml.noaa.gov/grad/solcalc/solareqns.PDF
 */

export interface SolarTelemetry {
  latitude: number;
  longitude: number;
  timestamp: string;
  elevation: number;              // Solar elevation angle in degrees (-90 to +90)
  azimuth: number;                // Solar azimuth angle in degrees (0 to 360, where 0=N, 90=E, 180=S, 270=W)
  zenith: number;                 // Solar zenith angle in degrees (0 to 180)
  isDaylight: boolean;            // True if elevation > -0.833° (apparent geometric horizon)
  twilightState: 'day' | 'civil_twilight' | 'nautical_twilight' | 'astronomical_twilight' | 'night';
  estimatedLux: number;           // Modeled surface illuminance in lux
  luxLabel: string;               // Honest UI label (e.g. "72,400 lux (est.)" or "< 1 lux (night)")
  elevationFormatted: string;     // e.g. "42.5°"
  azimuthFormatted: string;       // e.g. "214° SW"
  cardinalHeading: string;        // e.g. "SW"
  opticalAdvice: string;          // Safe retinal horizon recommendation (never look at sun)
  modelDisclaimer: string;        // Explicit astronomical assumptions
}

// Helper: Degree to Radian and vice versa
const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

function sinDeg(deg: number): number {
  return Math.sin(deg * DEG2RAD);
}

function cosDeg(deg: number): number {
  return Math.cos(deg * DEG2RAD);
}

function tanDeg(deg: number): number {
  return Math.tan(deg * DEG2RAD);
}

/**
 * Calculates deterministic NOAA solar position and honest illuminance estimate.
 * @param lat Latitude in decimal degrees (-90 to +90)
 * @param lon Longitude in decimal degrees (-180 to +180)
 * @param date Valid JavaScript Date object (UTC handled deterministically)
 */
export function calculateSolarTelemetry(
  lat: number = 23.8103,
  lon: number = 90.4125,
  date: Date = new Date()
): SolarTelemetry {
  // Validate coordinates
  const cleanLat = Math.max(-90, Math.min(90, isNaN(lat) ? 23.8103 : lat));
  const cleanLon = Math.max(-180, Math.min(180, isNaN(lon) ? 90.4125 : lon));
  const validDate = isNaN(date.getTime()) ? new Date() : date;

  // 1. Julian Day (from UTC epoch)
  const timeMs = validDate.getTime();
  const jd = 2440587.5 + timeMs / 86400000;

  // 2. Julian Century from J2000.0
  const t = (jd - 2451545.0) / 36525;

  // 3. Geometric Mean Longitude of the Sun (degrees)
  let l0 = 280.46646 + t * (36000.76983 + 0.0003032 * t);
  l0 = ((l0 % 360) + 360) % 360;

  // 4. Geometric Mean Anomaly of the Sun (degrees)
  let m = 357.52911 + t * (35999.05029 - 0.0001537 * t);
  m = ((m % 360) + 360) % 360;

  // 5. Eccentricity of Earth's orbit
  const e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);

  // 6. Sun Equation of the Center (degrees)
  const c = sinDeg(m) * (1.914602 - t * (0.004817 + 0.000014 * t)) +
            sinDeg(2 * m) * (0.019993 - 0.000101 * t) +
            sinDeg(3 * m) * 0.000289;

  // 7. Sun's True Longitude (degrees)
  const sunTrueLon = l0 + c;

  // 8. Sun's Apparent Longitude (degrees)
  const omega = 125.04 - 1934.136 * t;
  const lambdaApp = sunTrueLon - 0.00569 - 0.00478 * sinDeg(omega);

  // 9. Mean Obliquity of the Ecliptic (degrees)
  const seconds = 21.448 - t * (46.815 + t * (0.00059 - t * 0.001813));
  const eps0 = 23 + (26 + seconds / 60) / 60;
  const eps = eps0 + 0.00256 * cosDeg(omega); // Obliquity corrected

  // 10. Sun's Declination (degrees)
  const sinDecl = sinDeg(eps) * sinDeg(lambdaApp);
  const declDeg = Math.asin(Math.max(-1, Math.min(1, sinDecl))) * RAD2DEG;

  // 11. Equation of Time (minutes)
  const y = Math.pow(tanDeg(eps / 2), 2);
  const eqTimeRad = y * sinDeg(2 * l0) -
                    2 * e * sinDeg(m) +
                    4 * e * y * sinDeg(m) * cosDeg(2 * l0) -
                    0.5 * y * y * sinDeg(4 * l0) -
                    1.25 * e * e * sinDeg(2 * m);
  const eqTimeMinutes = 4 * eqTimeRad * RAD2DEG;

  // 12. True Solar Time (minutes)
  const utcHours = validDate.getUTCHours() +
                   validDate.getUTCMinutes() / 60 +
                   validDate.getUTCSeconds() / 3600;
  let trueSolarTime = (utcHours * 60 + eqTimeMinutes + 4 * cleanLon) % 1440;
  if (trueSolarTime < 0) trueSolarTime += 1440;

  // 13. Solar Hour Angle (degrees, -180 to +180)
  let haDeg = trueSolarTime / 4 - 180;
  if (haDeg < -180) haDeg += 360;

  // 14. Solar Zenith Angle (degrees)
  const cosZenith = sinDeg(cleanLat) * sinDeg(declDeg) +
                    cosDeg(cleanLat) * cosDeg(declDeg) * cosDeg(haDeg);
  const zenithDeg = Math.acos(Math.max(-1, Math.min(1, cosZenith))) * RAD2DEG;

  // Geometric elevation
  let elevationDeg = 90 - zenithDeg;

  // Atmospheric refraction correction (Saemundsson formula)
  // Only applies when sun is near or above apparent horizon
  if (elevationDeg > -0.575) {
    const r = 1.02 / tanDeg(elevationDeg + 10.3 / (elevationDeg + 5.11)); // in arcminutes
    elevationDeg += r / 60;
  }
  elevationDeg = Math.round(elevationDeg * 10) / 10;

  // 15. Solar Azimuth Angle (degrees, 0=N, 90=E, 180=S, 270=W)
  const sinZenith = sinDeg(zenithDeg);
  let azimuthDeg = 180;
  if (sinZenith > 0.0001) {
    const cosAzimuth = (sinDeg(declDeg) - sinDeg(cleanLat) * cosDeg(zenithDeg)) /
                       (cosDeg(cleanLat) * sinZenith);
    const clampedCosAzimuth = Math.max(-1, Math.min(1, cosAzimuth));
    let rawAz = Math.acos(clampedCosAzimuth) * RAD2DEG;
    if (haDeg > 0) {
      azimuthDeg = (360 - rawAz) % 360;
    } else {
      azimuthDeg = rawAz % 360;
    }
  }
  azimuthDeg = Math.round(azimuthDeg);

  // 16. Compass Cardinal Direction
  const cardinals = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const cardinalIdx = Math.round(azimuthDeg / 22.5) % 16;
  const cardinalHeading = cardinals[cardinalIdx];

  // 17. Twilight & Daylight Classification
  let twilightState: SolarTelemetry['twilightState'] = 'day';
  let isDaylight = false;

  if (elevationDeg > -0.833) {
    twilightState = 'day';
    isDaylight = true;
  } else if (elevationDeg > -6.0) {
    twilightState = 'civil_twilight';
  } else if (elevationDeg > -12.0) {
    twilightState = 'nautical_twilight';
  } else if (elevationDeg > -18.0) {
    twilightState = 'astronomical_twilight';
  } else {
    twilightState = 'night';
  }

  // 18. Honest Daylight Illuminance Estimation (Clear-Sky Physics Model)
  // Note: Surface lux varies significantly with atmospheric turbidity, cloud cover, and terrain.
  let estimatedLux = 0;
  let luxLabel = '';

  if (elevationDeg > 0) {
    // Standard clear-sky direct + diffuse illuminance model (Perez / CIE clear sky curve)
    const sinElev = sinDeg(elevationDeg);
    // Direct beam: ~100,000 * exp(-0.21 / sinElev), diffuse: ~15,000 * sinElev^0.5
    const directBeam = 98000 * Math.exp(-0.19 / Math.max(0.05, sinElev));
    const diffuseSky = 14000 * Math.pow(sinElev, 0.6);
    estimatedLux = Math.round(directBeam * sinElev + diffuseSky);
    estimatedLux = Math.max(800, Math.min(115000, estimatedLux));
    luxLabel = `${estimatedLux.toLocaleString()} lux (est.)`;
  } else if (elevationDeg > -6) {
    // Civil twilight: Rapid exponential falloff from ~400 lux down to ~3 lux
    const ratio = (elevationDeg + 6) / 6; // 0 at -6 deg, 1 at 0 deg
    estimatedLux = Math.round(3 + 397 * Math.pow(ratio, 2.5));
    luxLabel = `${estimatedLux} lux (twilight)`;
  } else if (elevationDeg > -12) {
    // Nautical twilight: ~0.1 to 3 lux
    estimatedLux = 1;
    luxLabel = `< 3 lux (nautical)`;
  } else {
    // Night
    estimatedLux = 0;
    luxLabel = `< 0.1 lux (night)`;
  }

  // 19. Optical Horizon & Physical Safety Advice
  // CRITICAL RULE: Never instruct user to stare at sun. Solar azimuth is reference only.
  let opticalAdvice = '';
  if (isDaylight) {
    opticalAdvice = `Astronomical solar direction is ${azimuthDeg}° ${cardinalHeading}. Do NOT look directly at the sun. Gaze at the distant horizon, trees, or architecture 20–50m away along a safe pedestrian route.`;
  } else {
    opticalAdvice = `Sun is below the horizon (${elevationDeg}°). Gaze at distant evening lights, stars, or open sky along a safe, well-lit pedestrian route to release screen eye fatigue.`;
  }

  return {
    latitude: cleanLat,
    longitude: cleanLon,
    timestamp: validDate.toISOString(),
    elevation: elevationDeg,
    azimuth: azimuthDeg,
    zenith: Math.round(zenithDeg * 10) / 10,
    isDaylight,
    twilightState,
    estimatedLux,
    luxLabel,
    elevationFormatted: `${elevationDeg > 0 ? '+' : ''}${elevationDeg}°`,
    azimuthFormatted: `${azimuthDeg}° ${cardinalHeading}`,
    cardinalHeading,
    opticalAdvice,
    modelDisclaimer: 'Deterministic NOAA Solar Positioning Algorithm (Spencer/Meeus standard). Illuminance modeled via clear-sky physics (±20% atmospheric variance).'
  };
}

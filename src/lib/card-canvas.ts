/**
 * BreakPoint Pocket Field Card Generator
 * Produces an ultra-crisp, high-contrast 1080x1920 mobile lockscreen wallpaper PNG
 * containing authentic telemetry and instructions for the active mission.
 */

import { BreakMission } from './cognitive-engine';
import { assetPath } from './asset-path';

export function downloadPocketFieldCard(mission: BreakMission): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return resolve();

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return reject(new Error('Canvas 2D context unavailable'));

    // 1. Background gradient (Deep Dark Slate)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1920);
    bgGrad.addColorStop(0, '#0a0f18');
    bgGrad.addColorStop(0.5, '#070b12');
    bgGrad.addColorStop(1, '#030508');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // 2. Tactical border container
    const marginX = 64;
    const marginY = 100;
    const width = 1080 - marginX * 2;
    const height = 1920 - marginY * 2;
    const radius = 44;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(marginX, marginY, width, height, radius);
    ctx.fillStyle = '#0d1522';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.stroke();
    ctx.clip(); // Clip for all inner elements

    // 3. Card Header
    ctx.textAlign = 'center';

    // Sun Icon
    ctx.font = '54px sans-serif';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('☀️', 540, marginY + 85);

    // Brand Title: BreakPoint
    ctx.font = 'bold 46px Inter, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Break', 500, marginY + 145);
    ctx.fillStyle = '#22c55e';
    ctx.fillText('Point', 595, marginY + 145);

    // Subtitle Badge
    ctx.font = '600 22px Inter, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.letterSpacing = '5px';
    ctx.fillText('POCKET FIELD CARD', 540, marginY + 185);

    // Blocker & Duration Tag
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillStyle = '#4ade80';
    ctx.letterSpacing = '1px';
    ctx.fillText(
      `${mission.blocker.label.toUpperCase()} • ${mission.durationMinutes}-MIN RESET`,
      540,
      marginY + 230
    );

    // 4. Embedded Landscape Painting
    const lakeImg = new Image();
    lakeImg.crossOrigin = 'anonymous';
    lakeImg.src = assetPath('/images/field-card-lake.jpg');

    const renderCardBody = () => {
      const imgY = marginY + 265;
      const imgH = 430;
      const imgW = width - 80;
      const imgX = marginX + 40;

      // Draw artwork
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgW, imgH, 20);
      ctx.clip();
      try {
        ctx.drawImage(lakeImg, imgX, imgY, imgW, imgH);
      } catch {
        // Fallback banner
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(imgX, imgY, imgW, imgH);
      }
      ctx.restore();

      // Image border
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgW, imgH, 20);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.stroke();

      // 5. Telemetry Banner below image
      const telemetryY = imgY + imgH + 45;
      ctx.font = '600 22px monospace';
      ctx.fillStyle = '#cbd5e1';
      ctx.textAlign = 'center';
      const solarText = `SUN: ${mission.solarTelemetry.elevationFormatted} (${mission.solarTelemetry.azimuthFormatted})  •  DAYLIGHT: ${mission.solarTelemetry.luxLabel}`;
      ctx.fillText(solarText, 540, telemetryY);

      // Return Deadline Pill
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(
        `RETURN DEADLINE: ${mission.returnTime} (TURNAROUND AT ${mission.turnaroundTime})`,
        540,
        telemetryY + 42
      );

      // 6. The 5 Tactical Steps
      const startStepY = telemetryY + 115;
      const stepGap = 125;

      mission.steps.forEach((step, idx) => {
        const stepY = startStepY + idx * stepGap;
        const circleX = marginX + 85;
        const circleRadius = 30;

        // Number Circle
        ctx.beginPath();
        ctx.arc(circleX, stepY - 10, circleRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fill();
        ctx.strokeStyle = idx === 2 ? '#22c55e' : 'rgba(255, 255, 255, 0.22)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Number Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText((idx + 1).toString(), circleX, stepY + 1);

        // Step Content
        ctx.fillStyle = idx === 2 ? '#86efac' : '#f1f5f9';
        ctx.font = '500 29px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(step, circleX + 55, stepY + 1);
      });

      // 7. Safety Notice & Cursive Footer
      ctx.textAlign = 'center';
      ctx.font = '400 20px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(mission.safetyNotice, 540, marginY + height - 120);

      ctx.font = 'bold 48px Caveat, cursive';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('Same Problem. Brighter Perspective.', 540, marginY + height - 60);

      // Underline Squiggle
      ctx.beginPath();
      ctx.moveTo(330, marginY + height - 42);
      ctx.quadraticCurveTo(540, marginY + height - 28, 750, marginY + height - 42);
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.restore();

      // Trigger File Download
      try {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        const safeBlocker = mission.blocker.id;
        link.download = `BreakPoint-${safeBlocker}-${mission.durationMinutes}m-Card.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        resolve();
      } catch (err) {
        reject(err);
      }
    };

    lakeImg.onload = renderCardBody;
    lakeImg.onerror = renderCardBody;
  });
}

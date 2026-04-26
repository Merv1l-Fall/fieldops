/**
 * Converts hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : null;
}

/**
 * Converts RGB to linear RGB
 */
function linearize(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Converts RGB to OKLAB
 */
function rgbToOklab(r: number, g: number, b: number): { L: number; a: number; b: number } {
  const lr = linearize(r);
  const lg = linearize(g);
  const lb = linearize(b);

  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.1929763977 * lr + 0.2847998409 * lg + 0.5043977753 * lb;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return {
    L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808649185 * s_,
  };
}

/**
 * Converts OKLAB to OKLCH
 */
function oklabToOklch(L: number, a: number, b: number): { L: number; C: number; H: number } {
  const C = Math.sqrt(a * a + b * b);
  let H = Math.atan2(b, a) * (180 / Math.PI);
  if (H < 0) H += 360;

  return { L, C, H };
}

/**
 * Converts hex color to OKLCH
 */
export function hexToOklch(
  hex: string
): { L: number; C: number; H: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const oklab = rgbToOklab(rgb.r, rgb.g, rgb.b);
  return oklabToOklch(oklab.L, oklab.a, oklab.b);
}

/**
 * Converts OKLCH back to hex
 */
function oklchToHex(L: number, C: number, H: number): string {
  const H_rad = (H * Math.PI) / 180;
  const a = C * Math.cos(H_rad);
  const b = C * Math.sin(H_rad);

  // OKLAB to linear RGB
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291506236 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  let r = 4.0767416621 * l - 3.3077363322 * m + 0.2309101289 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193761 * s;
  let bb = -0.0041960771 * l - 0.7034186147 * m + 1.707614701 * s;

  // Delinearize
  r = r <= 0.0031308 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - 0.055;
  g = g <= 0.0031308 ? 12.92 * g : 1.055 * Math.pow(g, 1 / 2.4) - 0.055;
  bb = bb <= 0.0031308 ? 12.92 * bb : 1.055 * Math.pow(bb, 1 / 2.4) - 0.055;

  const toHex = (value: number): string => {
    const clamped = Math.max(0, Math.min(1, value));
    const hex = Math.round(clamped * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(bb)}`;
}

/**
 * Generates color variants from a base OKLCH color
 * @param baseOklch - Base color in OKLCH format
 * @param lightnesses - Array of lightness values (0-1) for each variant
 */
export function generateColorVariants(
  baseOklch: { L: number; C: number; H: number },
  lightnesses: number[]
): string[] {
  return lightnesses.map((L) => oklchToHex(L, baseOklch.C, baseOklch.H));
}

/**
 * Updates CSS variables for primary color and its variants
 */
export function applyColorTheme(userColor: string): void {
  const oklch = hexToOklch(userColor);
  if (!oklch) {
    console.error("Invalid color format");
    return;
  }

  // Generate chart colors (5 variants with different lightness levels)
  const chartLightnesses = [0.845, 0.696, 0.596, 0.508, 0.432];
  const chartColors = generateColorVariants(oklch, chartLightnesses);

  // Generate primary color (main)
  const primaryColor = oklchToHex(oklch.L, oklch.C, oklch.H);
  
  // Generate lighter variant for foreground
  const primaryForeground = oklchToHex(0.979, oklch.C * 0.1, oklch.H);

  // Update CSS variables
  const root = document.documentElement;
  root.style.setProperty("--primary", `oklch(${oklch.L} ${oklch.C} ${oklch.H})`);
  root.style.setProperty(
    "--primary-foreground",
    `oklch(0.979 0.021 ${oklch.H})`
  );

  // Update chart colors
  chartColors.forEach((color, index) => {
    const oklchFromColor = hexToOklch(color);
    if (oklchFromColor) {
      root.style.setProperty(
        `--chart-${index + 1}`,
        `oklch(${oklchFromColor.L} ${oklchFromColor.C} ${oklchFromColor.H})`
      );
    }
  });

  // Update accent to match (or customize as needed)
  root.style.setProperty(`--accent`, `oklch(${oklch.L} ${oklch.C} ${oklch.H})`);
}

/**
 * Get current theme color from CSS variables
 */
export function getCurrentThemeColor(): string | null {
  const primary = getComputedStyle(document.documentElement)
    .getPropertyValue("--primary")
    .trim();
  // Returns oklch format, you might want to convert back to hex
  return primary || null;
}

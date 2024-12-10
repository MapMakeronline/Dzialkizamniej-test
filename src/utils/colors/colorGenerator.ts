export function generateDistinctColors(count: number): string[] {
  // Predefined colors for better visual distinction
  const baseColors = [
    '#2563eb', // Blue
    '#dc2626', // Red
    '#16a34a', // Green
    '#9333ea', // Purple
    '#ea580c', // Orange
    '#0891b2', // Cyan
    '#be123c', // Pink
    '#854d0e', // Brown
    '#4f46e5', // Indigo
    '#b91c1c', // Dark Red
    '#15803d', // Dark Green
    '#7e22ce', // Dark Purple
    '#c2410c', // Dark Orange
    '#0e7490', // Dark Cyan
    '#9f1239', // Dark Pink
    '#713f12', // Dark Brown
  ];

  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }

  // If we need more colors, generate them using HSL with better spacing
  return Array.from({ length: count }, (_, i) => {
    const hue = (i * (360 / count)) % 360;
    const saturation = 65 + (i % 2) * 10; // Alternate between 65% and 75% saturation
    const lightness = 45 + (i % 3) * 5; // Vary lightness between 45% and 55%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  });
}
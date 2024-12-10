import { memo } from 'react';
import { Tooltip } from 'react-leaflet';

interface FeatureTooltipProps {
  properties: Record<string, any>;
}

export const FeatureTooltip = memo(({ properties }: FeatureTooltipProps) => {
  // Filter out internal properties and geometry
  const displayProperties = Object.entries(properties)
    .filter(([key]) => !['id', 'geometry', 'layerId'].includes(key))
    .slice(0, 5); // Show first 5 properties only

  return (
    <Tooltip permanent={false} sticky direction="top">
      <div className="space-y-1 text-sm">
        {displayProperties.map(([key, value]) => (
          <div key={key}>
            <span className="font-medium">{key}: </span>
            <span>{value?.toString() || '-'}</span>
          </div>
        ))}
      </div>
    </Tooltip>
  );
});

FeatureTooltip.displayName = 'FeatureTooltip';
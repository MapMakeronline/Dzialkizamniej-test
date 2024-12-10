import { LayerStyle, AttributeStyle } from '../../store/layerStore';

function generateSLDHeader(layerName: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0" 
  xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" 
  xmlns="http://www.opengis.net/sld" 
  xmlns:ogc="http://www.opengis.net/ogc" 
  xmlns:xlink="http://www.w3.org/1999/xlink" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <Name>${layerName}</Name>
    <UserStyle>
      <Title>${layerName} Style</Title>`;
}

function generateSLDFooter(): string {
  return `
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>`;
}

function rgbToHex(color: string): string {
  // Handle HSL colors
  if (color.startsWith('hsl')) {
    return color;
  }
  return color;
}

function generateSimpleStyle(style: LayerStyle): string {
  const { color, fillColor, weight, opacity, fillOpacity } = style;
  
  return `
      <FeatureTypeStyle>
        <Rule>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">${rgbToHex(fillColor)}</CssParameter>
              <CssParameter name="fill-opacity">${fillOpacity}</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">${rgbToHex(color)}</CssParameter>
              <CssParameter name="stroke-width">${weight}</CssParameter>
              <CssParameter name="stroke-opacity">${opacity}</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>`;
}

function generateAttributeStyle(style: AttributeStyle): string {
  return style.rules.map(rule => `
      <FeatureTypeStyle>
        <Rule>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>${style.attribute}</ogc:PropertyName>
              <ogc:Literal>${rule.value}</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">${rgbToHex(rule.style.fillColor)}</CssParameter>
              <CssParameter name="fill-opacity">${rule.style.fillOpacity}</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">${rgbToHex(rule.style.color)}</CssParameter>
              <CssParameter name="stroke-width">${rule.style.weight}</CssParameter>
              <CssParameter name="stroke-opacity">${rule.style.opacity}</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>`).join('');
}

export function generateSLD(layerName: string, style: LayerStyle | AttributeStyle): string {
  const header = generateSLDHeader(layerName);
  const styleContent = 'attribute' in style 
    ? generateAttributeStyle(style)
    : generateSimpleStyle(style);
  const footer = generateSLDFooter();

  return header + styleContent + footer;
}
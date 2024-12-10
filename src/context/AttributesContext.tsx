import React, { createContext, useContext, useState } from 'react';
import { LatLngTuple } from 'leaflet';

interface AttributeItem {
  id: number;
  name: string;
  type: string;
  coordinates: LatLngTuple;
  description: string;
}

interface AttributesContextType {
  isExpanded: boolean;
  tableHeight: number;
  currentLayerId: string | null;
  setCurrentLayerId: (id: string | null) => void;
  toggleExpanded: () => void;
  setTableHeight: (height: number) => void;
  attributes: AttributeItem[];
}

const AttributesContext = createContext<AttributesContextType | undefined>(undefined);

export const AttributesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tableHeight, setTableHeight] = useState(250);
  const [currentLayerId, setCurrentLayerId] = useState<string | null>(null);
  const [attributes] = useState<AttributeItem[]>([
    {
      id: 1,
      name: 'Warsaw City Center',
      type: 'City',
      coordinates: [52.237049, 21.017532],
      description: 'Capital city of Poland'
    },
    {
      id: 2,
      name: 'Palace of Culture and Science',
      type: 'Landmark',
      coordinates: [52.229676, 21.012229],
      description: 'Iconic building in Warsaw\'s center'
    },
    {
      id: 3,
      name: 'Old Town Market Place',
      type: 'Historical',
      coordinates: [52.249279, 21.012228],
      description: 'Historic center of Warsaw'
    }
  ]);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <AttributesContext.Provider
      value={{
        isExpanded,
        tableHeight,
        currentLayerId,
        setCurrentLayerId,
        toggleExpanded,
        setTableHeight,
        attributes
      }}
    >
      {children}
    </AttributesContext.Provider>
  );
};

export const useAttributes = () => {
  const context = useContext(AttributesContext);
  if (context === undefined) {
    throw new Error('useAttributes must be used within an AttributesProvider');
  }
  return context;
};
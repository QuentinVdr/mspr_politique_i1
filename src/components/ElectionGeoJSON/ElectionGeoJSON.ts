import { TElection } from '@/types/ElectionType';
import L, { Layer } from 'leaflet';
import { useCallback, useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

// Component to handle GeoJSON updates
export default function ElectionGeoJSON({
  data,
  selectedYear,
  getElectionResultByCanton,
  cantonStyle
}: {
  data: any;
  selectedYear: number;
  getElectionResultByCanton: (canton: string) => TElection | undefined;
  cantonStyle: (feature: any) => any;
}) {
  const map = useMap();
  const geoJsonLayerRef = useRef<any>(null);

  const cantonPartyWinnerPourcentage = (cantonElection: TElection) => {
    const winnerParty = cantonElection.parti_gagnant;

    switch (winnerParty) {
      case 'extreme_gauche':
        return cantonElection.pct_vote_extreme_gauche;
      case 'gauche':
        return cantonElection.pct_vote_gauche;
      case 'centre':
        return cantonElection.pct_vote_centre;
      case 'droite':
        return cantonElection.pct_vote_droite;
      case 'extreme_droite':
        return cantonElection.pct_vote_extreme_droite;
      default:
        return 0;
    }
  };

  // Function to generate popup content
  const createPopupContent = (feature: unknown) => {
    const cantonElection = getElectionResultByCanton(feature.properties.Canton)!;

    return `
      <strong>Canton:</strong> ${cantonElection?.code_canton}<br/>
      <strong>Parti gagnant:</strong> ${cantonElection?.parti_gagnant} (${cantonPartyWinnerPourcentage(cantonElection)}%)<br/>
      <strong>Année:</strong> ${cantonElection?.annee}<br/>
      <strong>Population:</strong> ${cantonElection?.population?.toLocaleString()}<br/>
      <strong>Votes exprimés:</strong> ${cantonElection?.exprimes?.toLocaleString()}<br/>
      <strong>% Abstentions:</strong> ${cantonElection?.pct_abstentions?.toFixed(2)}%
    `;
  };

  // Handle features
  const onEachFeature = useCallback(
    (feature: any, layer: Layer) => {
      // Add popup with canton info
      layer.bindPopup(() => createPopupContent(feature));

      // Add hover effect
      layer.on({
        mouseover: (e: any) => {
          const layer = e.target;
          layer.setStyle({
            weight: 3,
            color: '#666',
            fillOpacity: 0.7
          });
          layer.bringToFront();
        },
        mouseout: (e: any) => {
          const layer = e.target;
          layer.setStyle(cantonStyle(feature));
        }
      });
    },
    [cantonStyle, createPopupContent]
  );

  // Effect to recreate GeoJSON layer when data or year changes
  useEffect(() => {
    // Remove existing layer if it exists
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.removeFrom(map);
    }

    // Create new layer
    if (data) {
      const geoJsonLayer = L.geoJSON(data, {
        style: cantonStyle,
        onEachFeature: onEachFeature
      });

      geoJsonLayer.addTo(map);
      geoJsonLayerRef.current = geoJsonLayer;

      // Cleanup on unmount
      return () => {
        if (geoJsonLayerRef.current) {
          geoJsonLayerRef.current.removeFrom(map);
        }
      };
    }
  }, [data, selectedYear, map, cantonStyle, onEachFeature]);

  // This component doesn't render anything, it just manages the layer
  return null;
}

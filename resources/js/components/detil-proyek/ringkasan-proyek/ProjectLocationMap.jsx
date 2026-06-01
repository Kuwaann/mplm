import { Map, useMap } from "@/components/ui/map";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import MapLibreGL from "maplibre-gl";

function MapMarker({ lat, lon }) {
    const { map } = useMap();

    useEffect(() => {
        if (!map) return;

        // Center map on the project's coordinates dynamically
        map.setCenter([lon, lat]);
        map.setZoom(9);

        // Add a red marker at coordinates
        const marker = new MapLibreGL.Marker({ color: "#ea4335" })
            .setLngLat([lon, lat])
            .addTo(map);

        return () => {
            marker.remove();
        };
    }, [map, lat, lon]);

    return null;
}

export function ProjectLocationMap({ lat = -0.9122, lon = 117.2511 }) {
    const { resolvedTheme } = useTheme();

    return (
        <div className="h-[150px] w-full relative">
            <Map center={[lon, lat]} zoom={9} theme={resolvedTheme}>
                <MapMarker lat={lat} lon={lon} />
            </Map>
        </div>
    );
}
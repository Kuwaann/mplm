"use client";

import MapLibreGL from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useEffect,
    useId,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import { X, Minus, Plus, Locate, Maximize, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const defaultStyles = {
    dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
    light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
};

const MapContext = createContext(null);

export function useMap() {
    const context = useContext(MapContext);
    if (!context) throw new Error("useMap must be used within a Map component");
    return context;
}

export const Map = forwardRef(function Map(
    {
        children,
        className,
        theme = "light",
        center = [117.2511, -0.9122], // Koordinat default (misal Kalimantan/Indonesia)
        zoom = 9,
        ...props
    },
    ref
) {
    const containerRef = useRef(null);
    const [mapInstance, setMapInstance] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useImperativeHandle(ref, () => mapInstance, [mapInstance]);

    useEffect(() => {
        if (!containerRef.current) return;

        const map = new MapLibreGL.Map({
            container: containerRef.current,
            style: theme === "dark" ? defaultStyles.dark : defaultStyles.light,
            center: center,
            zoom: zoom,
            attributionControl: false,
            ...props,
        });

        map.on("load", () => setIsLoaded(true));
        setMapInstance(map);

        return () => {
            map.remove();
            setIsLoaded(false);
            setMapInstance(null);
        };
    }, [theme]);

    return (
        <MapContext.Provider value={{ map: mapInstance, isLoaded }}>
            <div ref={containerRef} className={cn("relative h-full w-full rounded-md border", className)}>
                {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                )}
                {mapInstance && children}
            </div>
        </MapContext.Provider>
    );
});

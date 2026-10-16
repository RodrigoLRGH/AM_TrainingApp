import { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import type { Coordinate } from '../api/types';

type Props = {
    route: Coordinate[];
    follow?: boolean;
};

export function RunMap({ route, follow = false }: Props) {
    const mapRef = useRef<MapView>(null);

    function fitRoute() {
        if (route.length === 0) {
            return;
        }

        mapRef.current?.fitToCoordinates(route, {
            edgePadding: { top: 48, right: 48, bottom: 48, left: 48 },
            animated: false,
        });
    }

    useEffect(() => {
        if (route.length === 0) {
            return;
        }

        if (follow) {
            const last = route[route.length - 1];
            mapRef.current?.animateToRegion(
                {
                    latitude: last.latitude,
                    longitude: last.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                },
                500,
            );
        } else {
            fitRoute();
        }
    }, [route, follow]);

    return (
        <MapView ref={mapRef} style={styles.map} showsUserLocation={follow} onMapReady={fitRoute}>
            {route.length > 0 ? <Marker coordinate={route[0]} title="Inicio" /> : null}
            <Polyline coordinates={route} strokeColor="#2E5D4F" strokeWidth={5} />
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
});
import { useEffect, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Icon, Text, useTheme } from 'react-native-paper';
import type { Coordinate } from '../api/types';

type Props = {
    route: Coordinate[];
    follow?: boolean;
};

// El APK de Android no tiene clave de Google Maps, y sin ella el mapa puede cerrar la app.
// Expo Go ya incluye su propia clave, e iOS usa Apple Maps.
const MAP_AVAILABLE =
    Platform.OS !== 'android' ||
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export function RunMap(props: Props) {
    return MAP_AVAILABLE ? <RouteMap {...props} /> : <MapUnavailable />;
}

function MapUnavailable() {
    const { colors } = useTheme();

    return (
        <View style={[styles.unavailable, { backgroundColor: colors.surfaceVariant }]}>
            <Icon source="map-marker-off-outline" size={40} color={colors.onSurfaceVariant} />
            <Text
                variant="bodyMedium"
                style={[styles.unavailableText, { color: colors.onSurfaceVariant }]}
            >
                El mapa no está disponible en esta versión. Tu ruta, distancia y tiempo sí se
                registran.
            </Text>
        </View>
    );
}

function RouteMap({ route, follow = false }: Props) {
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
        <MapView
            ref={mapRef}
            style={styles.map}
            showsUserLocation={follow}
            onMapReady={fitRoute}
            onLayout={follow ? undefined : fitRoute}
        >
            {route.length > 0 ? <Marker coordinate={route[0]} title="Inicio" /> : null}
            <Polyline coordinates={route} strokeColor="#2E5D4F" strokeWidth={5} />
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
    unavailable: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        gap: 12,
    },
    unavailableText: {
        textAlign: 'center',
    },
});
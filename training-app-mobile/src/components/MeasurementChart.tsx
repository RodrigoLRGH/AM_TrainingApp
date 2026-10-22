import { useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';
import type { ChartPoint } from '../features/progress/metrics';

type Props = {
    points: ChartPoint[];
};

const HEIGHT = 200;
const PADDING_LEFT = 44;
const PADDING_RIGHT = 16;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 28;
const COLOR = '#2E5D4F';

function shortDate(iso: string) {
    return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

export function MeasurementChart({ points }: Props) {
    const [width, setWidth] = useState(0);

    function handleLayout(event: LayoutChangeEvent) {
        setWidth(event.nativeEvent.layout.width);
    }

    if (points.length === 0) {
        return <View style={styles.container} />;
    }

    const values = points.map((point) => point.value);
    let min = Math.min(...values);
    let max = Math.max(...values);

    if (min === max) {
        min -= 1;
        max += 1;
    }

    const plotWidth = width - PADDING_LEFT - PADDING_RIGHT;
    const plotHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;

    function xFor(index: number) {
        if (points.length === 1) {
            return PADDING_LEFT + plotWidth / 2;
        }
        return PADDING_LEFT + (index / (points.length - 1)) * plotWidth;
    }

    function yFor(value: number) {
        return PADDING_TOP + ((max - value) / (max - min)) * plotHeight;
    }

    const coordinates = points.map((point, index) => ({
        x: xFor(index),
        y: yFor(point.value),
    }));
    const line = coordinates.map((coordinate) => `${coordinate.x},${coordinate.y}`).join(' ');
    const baseY = HEIGHT - PADDING_BOTTOM;

    return (
        <View style={styles.container} onLayout={handleLayout}>
            {width > 0 ? (
                <Svg width={width} height={HEIGHT}>
                    <Line x1={PADDING_LEFT} y1={PADDING_TOP} x2={width - PADDING_RIGHT} y2={PADDING_TOP} stroke="#E0E0E0" />
                    <Line x1={PADDING_LEFT} y1={baseY} x2={width - PADDING_RIGHT} y2={baseY} stroke="#E0E0E0" />

                    <SvgText x={PADDING_LEFT - 6} y={PADDING_TOP + 4} fontSize={11} fill="#666" textAnchor="end">
                        {max.toFixed(1)}
                    </SvgText>
                    <SvgText x={PADDING_LEFT - 6} y={baseY + 4} fontSize={11} fill="#666" textAnchor="end">
                        {min.toFixed(1)}
                    </SvgText>

                    {points.length > 1 ? (
                        <Polyline points={line} fill="none" stroke={COLOR} strokeWidth={3} />
                    ) : null}

                    {coordinates.map((coordinate, index) => (
                        <Circle key={points[index].date} cx={coordinate.x} cy={coordinate.y} r={5} fill={COLOR} />
                    ))}

                    <SvgText x={PADDING_LEFT} y={HEIGHT - 8} fontSize={11} fill="#666" textAnchor="start">
                        {shortDate(points[0].date)}
                    </SvgText>
                    {points.length > 1 ? (
                        <SvgText x={width - PADDING_RIGHT} y={HEIGHT - 8} fontSize={11} fill="#666" textAnchor="end">
                            {shortDate(points[points.length - 1].date)}
                        </SvgText>
                    ) : null}
                </Svg>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: HEIGHT,
    },
});
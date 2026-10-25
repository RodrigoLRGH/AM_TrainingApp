import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type TabIconProps = {
    color: ColorValue;
    size: number;
};

export function tabIcon(name: IconName) {
    return function TabIcon({ color, size }: TabIconProps) {
        const iconColor = typeof color === 'string' ? color : undefined;

        return <MaterialCommunityIcons name={name} size={size} color={iconColor} />;
    };
}
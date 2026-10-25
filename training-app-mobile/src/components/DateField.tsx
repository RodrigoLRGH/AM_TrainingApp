import { Platform, View, StyleSheet } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import DateTimePicker, {
    DateTimePickerAndroid,
    type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { formatLongDate } from '../utils/format';

type Props = {
    value: Date;
    onChange: (date: Date) => void;
    minimumDate?: Date;
};

export function DateField({ value, onChange, minimumDate }: Props) {
    const theme = useTheme();

    function handleChange(event: DateTimePickerEvent, selected?: Date) {
        if (selected && event.type !== 'dismissed') {
            onChange(selected);
        }
    }

    function openAndroidCalendar() {
        DateTimePickerAndroid.open({
            value,
            mode: 'date',
            display: 'calendar',
            minimumDate,
            onChange: handleChange,
        });
    }

    if (Platform.OS === 'android') {
        return (
            <Button mode="outlined" icon="calendar" onPress={openAndroidCalendar}>
                {formatLongDate(value)}
            </Button>
        );
    }

    return (
        <View>
            <Text variant="bodyLarge" style={styles.selected}>
                {formatLongDate(value)}
            </Text>
            <DateTimePicker
                value={value}
                mode="date"
                display="inline"
                minimumDate={minimumDate}
                accentColor={theme.colors.primary}
                themeVariant="light"
                onChange={handleChange}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    selected: {
        textTransform: 'capitalize',
        marginBottom: 8,
    },
});
import { useState } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { Portal, Modal, Button, IconButton } from 'react-native-paper';
import DateTimePicker, {
    DateTimePickerAndroid,
    type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { RoutineDateBadge } from './RoutineDateBadge';

const GREEN = '#2E5D4F';
const GREEN_LIGHT = '#DCEDE3';

type Props = {
    value: Date;
    onChange: (date: Date) => void;
    minimumDate?: Date;
};

export function DateField({ value, onChange, minimumDate }: Props) {
    const [iosPickerOpen, setIosPickerOpen] = useState(false);

    function handleChange(event: DateTimePickerEvent, selected?: Date) {
        if (selected && event.type !== 'dismissed') {
            onChange(selected);
        }
    }

    function openPicker() {
        if (Platform.OS === 'android') {
            DateTimePickerAndroid.open({
                value,
                mode: 'date',
                display: 'calendar',
                minimumDate,
                onChange: handleChange,
            });
        } else {
            setIosPickerOpen(true);
        }
    }

    return (
        <View>
            <View style={styles.row}>
                <View>
                    <RoutineDateBadge date={value.toISOString()} />
                </View>
                <IconButton
                    icon="calendar-edit"
                    mode="contained"
                    containerColor={GREEN_LIGHT}
                    iconColor={GREEN}
                    size={24}
                    onPress={openPicker}
                    accessibilityLabel="Cambiar fecha"
                    style={styles.iconButton}
                />
            </View>

            {Platform.OS === 'ios' ? (
                <Portal>
                    <Modal
                        visible={iosPickerOpen}
                        onDismiss={() => setIosPickerOpen(false)}
                        contentContainerStyle={styles.modal}
                    >
                        <DateTimePicker
                            value={value}
                            mode="date"
                            display="inline"
                            minimumDate={minimumDate}
                            accentColor={GREEN}
                            themeVariant="light"
                            onChange={handleChange}
                        />
                        <Button mode="contained" onPress={() => setIosPickerOpen(false)}>
                            Listo
                        </Button>
                    </Modal>
                </Portal>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        margin: 0,
        marginLeft: 8,
    },
    modal: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        margin: 24,
        borderRadius: 12,
    },
});
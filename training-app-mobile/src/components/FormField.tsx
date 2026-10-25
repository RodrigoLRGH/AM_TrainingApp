import { useState } from 'react';
import { View, StyleSheet, type KeyboardTypeOptions, type TextInputProps } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';

type Props = {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    onBlur: () => void;
    error?: string;
    secure?: boolean;
    multiline?: boolean;
    keyboardType?: KeyboardTypeOptions;
    autoCapitalize?: TextInputProps['autoCapitalize'];
};

export function FormField({
    label,
    value,
    onChangeText,
    onBlur,
    error,
    secure = false,
    multiline = false,
    keyboardType,
    autoCapitalize,
}: Props) {
    const [hidden, setHidden] = useState(secure);

    return (
        <View style={styles.container}>
            <TextInput
                mode="outlined"
                label={label}
                value={value}
                onChangeText={onChangeText}
                onBlur={onBlur}
                error={!!error}
                secureTextEntry={hidden}
                multiline={multiline}
                style={multiline ? styles.multiline : undefined}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                autoCorrect={false}
                right={
                    secure ? (
                        <TextInput.Icon
                            icon={hidden ? 'eye' : 'eye-off'}
                            onPress={() => setHidden((prev) => !prev)}
                        />
                    ) : undefined
                }
            />
            {error ? <HelperText type="error">{error}</HelperText> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    multiline: {
        minHeight: 120,
    },
});
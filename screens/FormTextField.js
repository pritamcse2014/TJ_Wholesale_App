import React from 'react';
import { Text, View, TextInput, StyleSheet } from "react-native";
import PropTypes from 'prop-types';

export default function FormTextField({ label, errors = [], ...rest }) {
    return (
        <View>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput style={styles.textInput} autoCapitalize="none" {...rest} />
            {
                errors.map((error) => {
                    return (
                        <Text key={error} style={styles.error}>{error}</Text>
                    )
                })
            }
        </View>
    );
}

FormTextField.propTypes = {
    label: PropTypes.string,
};

const styles = StyleSheet.create({
    label: {
        color: "#334155",
        fontWeight: '500',
    },
    textInput: {
        backgroundColor: "#f1f5f9",
        height: 40,
        marginTop: 4,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: "#cbd5e1",
        padding: 10,
    },
    error: {
        color: "red",
        marginTop: 2
    }
});
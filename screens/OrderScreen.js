import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function OrderScreen({ order }) {
    const { invoice, total_price, wholeseller_id, reseller_id, status } = order;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'orange';
            case 'Completed':
                return 'green';
            case 'Cancelled':
                return 'red';
            default:
                return 'gray';
        }
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Invoice: {invoice}</Text>
            <Text>Total Price: ${total_price}</Text>
            <Text>Wholeseller ID: {wholeseller_id}</Text>
            <Text>Reseller ID: {reseller_id}</Text>
            <View style={styles.statusContainer}>
                <TouchableOpacity style={[styles.statusButton, { backgroundColor: getStatusColor(status) }]} accessible={true} accessibilityLabel={`Status: ${status}`}>
                    <Text style={styles.statusText}>{status}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    statusContainer: {
        marginTop: 10,
    },
    statusButton: {
        padding: 5,
        borderRadius: 5,
    },
    statusText: {
        color: '#fff',
        textAlign: 'center',
    },
});

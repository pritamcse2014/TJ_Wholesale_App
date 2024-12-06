import React from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function FilterScreen({ productFilter }) {
    const { product_name } = productFilter; // Only extracting product_name for display
    const navigation = useNavigation();

    const handleProductDetails = () => {
        if (productFilter) {
            navigation.navigate('Filter Details', { productFilter });
        } else {
            console.error('Product Filter is undefined');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {product_name ? (
                <TouchableOpacity onPress={handleProductDetails}>
                    <Text style={styles.title}>{product_name}</Text>
                </TouchableOpacity>
            ) : (
                <Text style={styles.title}>Product name not available</Text>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        borderBottomWidth: 1, // Only bottom border
        borderBottomColor: '#ccc', // Color for the bottom border
        justifyContent: 'center', // Vertically center the text
    },
    title: {
        fontSize: 10, // Made font size bigger for better readability
    },
});

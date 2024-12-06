import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { getToken } from "../services/TokenService";
import { API_URLS } from "./api";
import TrendyScreen from './TrendyScreen';

export default function ProductScreen() {
    const [products, setProducts] = useState();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const token = await getToken();
                // console.log(token);
                
                const response = await fetch(API_URLS.getProducts, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                // console.log(response);
                

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setProducts(data);
                setFilteredProducts(data); // Initialize with the full product list
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Loading products...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.grid}>
                {filteredProducts.length ? filteredProducts.map((trendy) => (
                    <View key={trendy.id} style={styles.gridItem}>
                        <TrendyScreen trendyScreen={trendy} />
                    </View>
                )) : (
                    <View style={styles.centered}>
                        <Text>No Products Found....</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        padding: 16,
    },
    grid: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        margin: 10
    },
    gridItem: {
        marginBottom: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
    },
    errorText: {
        color: 'red',
    },
});

import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, TextInput, Text, ActivityIndicator } from "react-native";
import { getToken } from "../services/TokenService";
import { API_URLS } from "./api";
import FilterScreen from './FilterScreen';

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

    const handleSearch = (text) => {
        const filtered = products.filter(product =>
            product.product_name?.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

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
            {/* Search Input */}
            <TextInput
                style={styles.searchInput}
                placeholder="Search Products...."
                onChangeText={handleSearch}
            />

            <View style={styles.list}>
                {filteredProducts.length ? (
                    filteredProducts.map((product) => (
                        <View key={product.id} style={styles.listItem}>
                            <FilterScreen productFilter={product} />
                        </View>
                    ))
                ) : (
                    <View style={styles.centered}>
                        <Text>No Products Found....</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

// Styles
const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
        borderRadius: 5,
        marginTop: 30
    },
    list: {
        flexDirection: 'column',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

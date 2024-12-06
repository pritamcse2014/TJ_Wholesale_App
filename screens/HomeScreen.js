import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, TextInput, Text, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import ProductListScreen from "./ProductListScreen";
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { logout } from "../services/AuthService";
import AuthContext from "../context/AuthContext";
import Carousel from "./Carousel";
import { getToken, setToken } from "../services/TokenService";
import { API_URLS } from "./api";

export default function ProductScreen() {
    const [products, setProducts] = useState();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();
    const { setUser } = useContext(AuthContext);

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

    const handleShowCart = () => {
        navigation.navigate('Product Cart');
    };

    const handleLogout = async () => {
        try {
            await logout();
            await setToken(null); // Clear the token from SecureStore
            setUser(null); // Clear user context
        } catch (err) {
            console.error('Error logging out:', err);
        }
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
            <View style={styles.header}>
                <Image source={require('../assets/images/logo.jpeg')} style={styles.logo} />
                <TextInput
                    style={styles.searchBox}
                    placeholder="Search Products...."
                    onChangeText={handleSearch}
                />
                <TouchableOpacity style={styles.showCartButton} onPress={handleShowCart}>
                    <Icon name="cart" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.addButton} onPress={handleLogout}>
                    <Text style={styles.addButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
            <Carousel />
            <View style={styles.grid}>
                {filteredProducts.length ? filteredProducts.map((product) => (
                    <View key={product.id} style={styles.gridItem}>
                        <ProductListScreen productScreen={product} />
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    logo: {
        width: 44,
        height: 44,
        resizeMode: 'contain',
        borderRadius: 22,
    },
    searchBox: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginHorizontal: 5,
    },
    showCartButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007bff',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 5,
        marginRight: 5,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 12,
        marginLeft: 2,
    },
    grid: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        margin: 10,
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

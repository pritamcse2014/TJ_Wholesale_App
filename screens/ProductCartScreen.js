import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { getToken } from '../services/TokenService';
import { API_URLS } from './api'; // Ensure this file contains the correct API URLs

// Function to fetch order requests based on tokenable_id
const fetchOrderRequests = async (tokenable_id) => {
    const token = await getToken();
    const url = API_URLS.getOrderRequests(tokenable_id);
    console.log("Fetching from URL:", url);

    try {
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Order Requests Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching order requests:", error);
        Alert.alert('Error', 'Failed to fetch order requests');
        return [];
    }
};

const ProductCartScreen = () => {
    const [cartProducts, setCartProducts] = useState([]);
    const [previousCartProducts, setPreviousCartProducts] = useState([]);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const loadCartProducts = async () => {
            try {
                const savedProducts = await AsyncStorage.getItem('cartProducts');
                if (savedProducts) {
                    const parsedProducts = JSON.parse(savedProducts);
                    if (Array.isArray(parsedProducts)) setCartProducts(parsedProducts);
                }

                const previousProducts = await AsyncStorage.getItem('previousCartProducts');
                if (previousProducts) {
                    const parsedPreviousProducts = JSON.parse(previousProducts);
                    if (Array.isArray(parsedPreviousProducts)) setPreviousCartProducts(parsedPreviousProducts);
                }
            } catch (error) {
                console.error("Error loading cart products:", error);
            }
        };

        const unsubscribe = navigation.addListener('focus', loadCartProducts);
        return unsubscribe;
    }, [navigation]);

    const deleteProduct = async (index) => {
        try {
            const updatedCartProducts = cartProducts.filter((_, i) => i !== index);
            setCartProducts(updatedCartProducts);
            await AsyncStorage.setItem('cartProducts', JSON.stringify(updatedCartProducts));
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const confirmDelete = (index) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this product?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', onPress: () => deleteProduct(index) },
            ],
            { cancelable: false }
        );
    };

    const calculateTotalQuantity = () => {
        const allProducts = [...cartProducts, ...previousCartProducts];
        return allProducts.reduce((total, product) => {
            const quantity = parseInt(product.product_quantity || 0, 10);
            return total + quantity;
        }, 0);
    };

    const calculateTotalCost = () => {
        const allProducts = [...cartProducts, ...previousCartProducts];
        return allProducts.reduce((total, product) => {
            const price = parseFloat(product.sale_price || 0);
            const quantity = parseInt(product.product_quantity || 0, 10);
            return total + (price * quantity);
        }, 0);
    };

    const handlePlaceOrder = async () => {
        try {
            const token = await getToken();
            if (!token) {
                Alert.alert('Error', 'User is not authenticated');
                return;
            }

            const invoice = `INV-${Date.now()}`;
            const totalPrice = calculateTotalCost();
            console.log('Order Data:', JSON.stringify({ invoice, totalPrice }));

            const orderData = {
                invoice,
                wholeseller_id: 4,
                reseller_id: 3,
                total_price: totalPrice,
                products: cartProducts.map(product => ({
                    product_id: product.product_id,
                    product_quantity: parseInt(product.product_quantity, 10),
                    sale_price: parseFloat(product.sale_price),
                    variation_id: product.variation_id,
                })),
            };

            const response = await axios.post(API_URLS.createOrder, orderData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200 || response.status === 201) {
                setCartProducts([]);
                setOrderPlaced(true);
                await AsyncStorage.removeItem('cartProducts');
                navigation.navigate('Order Details', { orderData });
                console.log('Success', 'Order Placed Successfully');
            } else {
                Alert.alert('Error', 'Failed to place the order');
            }
        } catch (error) {
            console.error("Error submitting order request:", error);
            Alert.alert('Error', error.response ? error.response.data : 'Failed to place the order');
        }
    };

    return (
        <View style={styles.container}>
            {cartProducts.length > 0 ? (
                <FlatList
                    data={cartProducts}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View style={styles.productContainer}>
                            <TouchableOpacity style={styles.textContainer}>
                                <Text style={styles.productText}>{item.product}</Text>
                                <Text style={styles.priceText}>
                                    {item.sale_price ? `Price: $${item.sale_price}` : `Price: $${item.regular_price}`}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => confirmDelete(index)}>
                                <MaterialIcons name="delete" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.noProduct}>No products in the cart</Text>
            )}

            <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>Total Quantity: {calculateTotalQuantity()}</Text>
                <Text style={styles.summaryText}>Total Cost: ${calculateTotalCost().toFixed(2)}</Text>
            </View>

            {!orderPlaced && cartProducts.length > 0 && (
                <TouchableOpacity style={styles.addButton} onPress={handlePlaceOrder}>
                    <Icon name="cart" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Place Order</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    productContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginTop: 20
    },
    textContainer: {
        flex: 1,
    },
    productText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    priceText: {
        fontSize: 10,
        color: 'green',
        marginBottom: 8,
    },
    noProduct: {
        marginTop: 20
    },
    summaryContainer: {
        marginTop: 10,
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    summaryText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'green'
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'green',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 5,
        marginTop: 10,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 10,
        marginLeft: 2,
    },
});

export default ProductCartScreen;

import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Alert, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { useCart } from './CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URLS } from './apiTwo';

export default function TrendyScreen({ trendyScreen }) {
    const { product_image, product_name, sale_price, regular_price, product_description, trendy_product, trendy_product_priority
    } = trendyScreen;
    const [variations, setVariations] = useState([]);
    const [selectedVariation, setSelectedVariation] = useState(null);
    const { addToCart } = useCart();
    const navigation = useNavigation();
    const url = API_URLS.getVariations;

    const baseUrl = 'https://wholesale.techjodo.xyz/public/upload/';
    const productImageUrl = `${baseUrl}${product_image}`;

    const limitedDescription = product_description.split(' ').slice(0, 5).join(' ');

    const handleProductDetails = () => {
        navigation.navigate('Trendy Details', { trendyScreen });
    };

    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => setVariations(data))
            .catch(error => {
                console.error("Error fetching variations:", error);
                Alert.alert("Error", "Failed to load variations.");
            });
    }, []);

    const handleAddToCart = async () => {
        if (!selectedVariation && !isMobile) {
            Alert.alert('Error', 'Please select a variation first.');
            return;
        }
    
        try {
            const existingCart = await AsyncStorage.getItem('cartProducts');
            let cartItems = existingCart ? JSON.parse(existingCart) : [];
    
            const existingItem = cartItems.find(
                (item) => item.product === product_name
            );
    
            if (existingItem) {
                Alert.alert('Error', 'You already have a variation of this product in the cart. Please remove it before adding a new one.');
                return;
            }
    
            const cartItem = {
                product: product_name,
                product_image,
                product_description,
                variation: `Qty: ${selectedVariation?.start_quantity} - ${selectedVariation?.end_quantity}`,
                sale_price,
                regular_price,
            };
            cartItems.push(cartItem);
    
            await AsyncStorage.setItem('cartProducts', JSON.stringify(cartItems));
    
            addToCart({ ...trendyScreen, selectedVariation });
            navigation.navigate('Product Cart');
        } catch (error) {
            console.error("Error saving to AsyncStorage:", error);
            Alert.alert("Error", "Failed to add item to cart.");
        }
    };

    const screenWidth = Dimensions.get('window').width;
    const isMobile = screenWidth < 768;

    // Conditionally render the component if trendy_product is "Yes"
    if (trendy_product !== "Yes") {
        return null; // Do not render if the product is not marked as trendy
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.productContainer}>
                {/* Left side: Image */}
                <Image alt="Product Image" resizeMode="contain" style={styles.productImg} source={{ uri: productImageUrl }} />
                
                {/* Right side: Product details */}
                <View style={styles.productDetails}>
                    <TouchableOpacity onPress={handleProductDetails}>
                        <Text style={styles.title}>{product_name}</Text>
                    </TouchableOpacity>
                    {!isMobile && (
                        <>
                            <Text style={styles.price}>Price: ${sale_price}</Text>
                            <Text style={[styles.price, styles.strikethrough]}>Regular Price: ${regular_price}</Text>
                            <Text style={styles.description}>{limitedDescription}...</Text>
                        </>
                    )}

                    {/* Show Picker only on non-mobile screens */}
                    {!isMobile && (
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedVariation?.id}
                                onValueChange={(itemValue) => {
                                    const selected = variations.find(variation => variation.id === itemValue);
                                    setSelectedVariation(selected);
                                }}
                            >
                                <Picker.Item style={styles.pickerVariation} label="Select a Variation" value={null} />
                                {variations.map(variation => (
                                    <Picker.Item
                                        style={styles.pickerItem}
                                        key={variation.id}
                                        label={`Qty: ${variation.start_quantity} - ${variation.end_quantity}`}
                                        value={variation.id}
                                    />
                                ))}
                            </Picker>
                        </View>
                    )}

                    {!isMobile && (
                        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                            <Icon name="cart-outline" size={20} color="#fff" />
                            <Text style={styles.addButtonText}>Add to Cart</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    productContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    productImg: {
        width: '40%', // Adjust the width to occupy 40% of the container
        height: 100,
        marginBottom: 16,
    },
    productDetails: {
        width: '55%', // Adjust to fit in the remaining space
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    price: {
        fontSize: 10,
        color: 'green',
        marginBottom: 8,
    },
    strikethrough: {
        textDecorationLine: 'line-through',
        color: 'red',
    },
    description: {
        fontSize: 10,
        color: '#444',
        marginBottom: 16,
    },
    pickerContainer: {
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
    },
    pickerVariation: {
        fontSize: 10,
    },
    pickerItem: {
        fontSize: 10,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'green',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 5,
        marginTop: 15
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 10,
        marginLeft: 2
    },
});

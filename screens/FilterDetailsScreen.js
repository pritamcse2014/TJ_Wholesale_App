import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    Dimensions,
    TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCart } from './CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrendyProductScreen from './TrendyProductScreen';
import { API_URLS } from './apiTwo';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen({ route }) {
    const { productFilter } = route.params;
    const [variations, setVariations] = useState([]);
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [quantity, setQuantity] = useState(''); // Local state for quantity input
    const { addToCart } = useCart();
    const navigation = useNavigation();
    const url = API_URLS.getVariations;

    const baseUrl = 'https://wholesale.techjodo.xyz/public/upload/';
    const productImageUrl = `${baseUrl}${productFilter.product_image}`;

    useEffect(() => {
        fetch(url)
            .then((response) => response.json())
            .then((data) => setVariations(data))
            .catch((error) => {
                console.error('Error fetching variations:', error);
                Alert.alert('Error', 'Failed to load variations.');
            });
    }, []);

    const handleAddToCart = async () => {
        if (!quantity) {
            Alert.alert('Error', 'Please enter a quantity first.');
            return;
        }

        try {
            const existingCart = await AsyncStorage.getItem('cartProducts');
            let cartItems = existingCart ? JSON.parse(existingCart) : [];

            // Remove any existing variation of the same product
            cartItems = cartItems.filter(
                (item) => item.product_id !== productFilter.id
            );

            // Add the new product variation
            const cartItem = {
                product_id: productFilter.id,
                product: productFilter.product_name,
                variation: selectedVariation
                    ? `Qty: ${selectedVariation.start_quantity} - ${selectedVariation.end_quantity}`
                    : 'No variation selected',
                sale_price: productFilter.sale_price,
                regular_price: productFilter.regular_price,
                product_quantity: quantity,
                variation_id: selectedVariation?.id || 'no-variation',
            };

            cartItems.push(cartItem); // Add the new variation
            console.log(cartItem);

            await AsyncStorage.setItem('cartProducts', JSON.stringify(cartItems));
            addToCart({ ...productFilter, selectedVariation, product_quantity: quantity });
            navigation.navigate('Product Cart');
        } catch (error) {
            console.error('Error saving to AsyncStorage:', error);
            Alert.alert('Error', 'Failed to add item to cart.');
        }
    };

    return (
        <ScrollView style={styles.scrollView}>
            <SafeAreaView style={styles.container}>
                <Image style={styles.productImg} source={{ uri: productImageUrl }} />
                <Text style={styles.title}>{productFilter.product_name}</Text>
                <View style={styles.priceContainer}>
                    {width > 600 && (
                        <Text style={[styles.price, styles.strikethrough]}>
                            Regular Price: ${productFilter.regular_price}
                        </Text>
                    )}
                </View>
                <Text style={styles.description}>{productFilter.product_description}</Text>
                <Text style={styles.price}>Price: ${productFilter.sale_price}</Text>

                <View style={styles.buttonContainer}>
                    <View style={styles.buttonRow}>
                        {variations.map((variation) => (
                            <TouchableOpacity
                                key={variation.id}
                                style={[
                                    styles.button,
                                    selectedVariation?.id === variation.id && styles.selectedButton,
                                ]}
                                onPress={() => setSelectedVariation(variation)}
                            >
                                <Text style={styles.buttonText}>
                                    Qty: {variation.start_quantity} - {variation.end_quantity} | ${productFilter.sale_price}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.buttonLabel}>Quantity</Text>
                    <TextInput
                        style={styles.quantityInput}
                        keyboardType="numeric"
                        placeholder="Type Quantity"
                        value={quantity}
                        onChangeText={(text) => {
                            setQuantity(text);
                            const enteredQuantity = parseInt(text);

                            if (isNaN(enteredQuantity) || enteredQuantity <= 0) {
                                setSelectedVariation(null);
                                return;
                            }

                            const matchedVariation = variations.find(
                                (variation) =>
                                    enteredQuantity >= variation.start_quantity &&
                                    enteredQuantity <= variation.end_quantity
                            );

                            setSelectedVariation(matchedVariation || variations[variations.length - 1]);
                        }}
                    />
                </View>

                <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                    <Icon name="cart-outline" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add to Cart</Text>
                </TouchableOpacity>
            </SafeAreaView>
            <Text style={styles.related}>Related Products</Text>
            <TrendyProductScreen />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    productImg: {
        width: '100%',
        height: 350,
        resizeMode: 'contain',
        marginBottom: 8,
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    price: {
        fontSize: 12,
        color: 'green',
        marginBottom: 5,
    },
    strikethrough: {
        textDecorationLine: 'line-through',
        color: 'red',
    },
    scrollView: {
        maxHeight: 1200,
    },
    description: {
        fontSize: 10,
        color: '#444',
        marginBottom: 8,
    },
    buttonContainer: {
        marginVertical: 10,
    },
    buttonLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    buttonRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
    button: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginBottom: 8,
        width: '48%',
        alignItems: 'center',
    },
    selectedButton: {
        backgroundColor: '#4444',
        borderColor: '#54545454',
        borderWidth: 1,
    },
    buttonText: {
        fontSize: 10,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 8,
    },
    quantityInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
        fontSize: 12,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 10,
        marginLeft: 5,
    },
    related: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 16,
        marginTop: 8,
    },
});

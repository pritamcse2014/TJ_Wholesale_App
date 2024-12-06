import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';

const OrderDetailsScreen = ({ route }) => {
    const { orderData } = route.params; // Retrieve the order data from navigation
    const navigation = useNavigation();
    
    const goToHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Product' }],
            })
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.invoiceText}>{orderData.invoice}</Text>
            <FlatList
                data={orderData.products}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.productContainer}>
                        <Text style={styles.productLabel}>Quantity: {item.product_quantity}</Text>
                        <Text style={styles.productLabel}>Price: ${item.sale_price.toFixed(2)}</Text>
                    </View>
                )}
                contentContainerStyle={styles.listContent}
            />
            <Text style={styles.totalPrice}>Total Price: ${orderData.total_price.toFixed(2)}</Text>
            <TouchableOpacity style={styles.footer} onPress={goToHome}>
                <Text style={styles.footerText}>Home</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    invoiceText: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        color: 'green'
    },
    productContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    productLabel: {
        color: '#333',
    },
    listContent: {
        paddingBottom: 20,
    },
    totalPrice: {
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 10,
        color: 'green',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        textAlign: 'center'
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    footerText: {
        color: '#FFF',
        fontSize: 10,
    },
});

export default OrderDetailsScreen;

import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
            if (existingItemIndex > -1) {
                // If item already exists, update quantity
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex].quantity += 1;
                return updatedCart;
            } else {
                // If item doesn't exist, add it with quantity 1
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    const updateQuantity = (id, newQuantity) => {
        setCart((prevCart) => 
            prevCart.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const getCart = () => cart;

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, getCart }}>
            {children}
        </CartContext.Provider>
    );
};

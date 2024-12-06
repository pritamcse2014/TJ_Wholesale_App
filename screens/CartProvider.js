export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart((prevCart) => [...prevCart, product]);
    };

    const getCart = () => {
        console.log('getCart called, returning:', cart);
        return cart;
    };

    console.log('Providing cart context:', { cart, addToCart, getCart });

    return (
        <CartContext.Provider value={{ cart, addToCart, getCart }}>
            {children}
        </CartContext.Provider>
    );
};

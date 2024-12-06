import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { CartProvider } from '../screens/CartContext';
import AuthContext from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import ProductCartScreen from '../screens/ProductCartScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import FilterProductScreen from '../screens/FilterProductScreen';
import FilterDetailsScreen from '../screens/FilterDetailsScreen';
import TrendyProductScreen from '../screens/TrendyProductScreen';
import TrendyDetailsScreen from '../screens/TrendyDetailsScreen';
import { getToken } from '../services/TokenService';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// Drawer Navigator
function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Product" component={HomeScreen} />
      <Drawer.Screen name="Product Cart" component={ProductCartScreen} />
    </Drawer.Navigator>
  );
}

// Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Filter') {
            iconName = focused ? 'filter' : 'filter-outline';
          } else if (route.name === 'Trendy') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: 'black',
      })}
    >
      <Tab.Screen name="Home" component={DrawerNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Cart" component={ProductCartScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Filter" component={FilterProductScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Trendy" component={TrendyProductScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

// Stack Navigator for authenticated user
function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Product" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Product Details" component={ProductDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Filter Details" component={FilterDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Order Details" component={OrderDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Trendy Details" component={TrendyDetailsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// Stack Navigator for unauthenticated user
function AuthFlow() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Forgot Password" component={ForgotPasswordScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkToken() {
      try {
        const token = await getToken();
        if (token) {
          setUser({ token });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking token:', error);
        setUser(null);
      }
    }
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <CartProvider>
        <NavigationContainer independent={true}>
          {user ? <AuthStack /> : <AuthFlow />}
        </NavigationContainer>
      </CartProvider>
    </AuthContext.Provider>
  );
}

import React, { useContext, useState } from 'react';
import {  
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    Image, 
    Platform, 
    ActivityIndicator 
} from 'react-native';
import { loadUser, login } from '../services/AuthService';
import AuthContext from '../context/AuthContext';
import FormTextField from './FormTextField';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { setUser } = useContext(AuthContext);

    async function handleLogin() {
        setErrors({});
        setLoading(true);

        // Basic form validation
        if (!email || !password) {
            setErrors({
                email: !email ? ["Email is required."] : [],
                password: !password ? ["Password is required."] : [],
            });
            setLoading(false);
            return;
        }

        try {
            await login({ email, password });
            const user = await loadUser();
            setUser(user);
            setLoading(false);
        } catch (error) {
            setLoading(false); // Ensure loading stops even if there's an error

            if (error.response?.status === 401) {
                // Invalid credentials error
                setErrors({ general: ["Invalid email or password."] });
            } else if (error.response?.status === 422) {
                // Validation errors from the server
                setErrors(error.response.data.errors);
            } else if (error.response) {
                console.error(`API error (status: ${error.response.status}):`, error.response.data);
            } else if (error.request) {
                console.error("No response from the server:", error.request);
            } else {
                console.error("Request setup error:", error.message);
            }
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.column}>
                <View style={styles.formContainer}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={{ uri: 'https://techjodo.com/techjodo-logo.png' }}
                            style={styles.logo}
                            alt="logo"
                        />
                    </View>

                    {/* Display General Error Message */}
                    {errors.general && (
                        <Text style={styles.generalErrorText}>{errors.general[0]}</Text>
                    )}

                    <FormTextField
                        style={styles.input}
                        placeholder="Enter Your Email"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        errors={errors?.email}
                    />
                    <FormTextField
                        style={styles.input}
                        placeholder="Enter Your Password"
                        placeholderTextColor="#999"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        errors={errors?.password}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.loginButton}
                            activeOpacity={0.7}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.loginButtonText}>Login</Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Forgot Password")}>
                            <Text style={styles.forgotPassword}>Forgot password?</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.registerContainer}>
                        <Text>Don't have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                            <Text style={styles.registerButton}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
    },
    column: {
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    formContainer: {
        backgroundColor: "white",
        borderRadius: 8,
        width: "100%",
        maxWidth: 400,
        paddingVertical: 40,
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    input: {
        height: 48,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    generalErrorText: {
        color: "red",
        marginBottom: 15,
        textAlign: "center",
        fontSize: 14,
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 30,
    },
    logo: {
        width: 220,
        height: 100,
    },
    buttonContainer: {
        marginTop: 20,
    },
    loginButton: {
        backgroundColor: "#ff5a5f",
        paddingVertical: 12,
        borderRadius: 4,
        alignItems: "center",
    },
    loginButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    forgotPassword: {
        marginTop: 15,
        color: "#999",
        textAlign: "center",
    },
    registerContainer: {
        marginTop: 20,
        alignItems: "center",
    },
    registerButton: {
        color: 'green',
        marginLeft: 5,
    },
});

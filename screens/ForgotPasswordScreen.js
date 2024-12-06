import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Image, Text, Platform } from "react-native";
import FormTextField from './FormTextField';
import { sendPasswordResetLink } from '../services/AuthService';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [resetStatus, setResetStatus] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    async function handleForgotPassword() {
        setErrors({});
        setLoading(true);
        setResetStatus("");

        if (!email) {
            setErrors({ email: ["Email is Required."] });
            setLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setErrors({ email: ["Invalid email address."] });
            setLoading(false);
            return;
        }

        try {
            const status = await sendPasswordResetLink({ email });
            setLoading(false);
            setResetStatus(status);
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else if (error.response) {
                console.error(`API error (status: ${error.response.status}):`, error.response.data);
            } else if (error.request) {
                console.error("No response from the server:", error.request);
            } else {
                console.error("Request setup error:", error.message);
            }
            setLoading(false);
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
                    <FormTextField
                        style={styles.input}
                        placeholder="Enter Your Email"
                        placeholderTextColor="#999"
                        keyboardType="email"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        errors={errors?.email}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.passwordResetButton} activeOpacity={0.7} onPress={handleForgotPassword}>
                        <Text style={styles.passwordResetButtonText} title="Password Reset Link">Password Reset Link</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.registerContainer}>
                        <Text>Already have an Account?</Text>
                        <TouchableOpacity onPress={ () => { navigation.navigate("Login") } } title="Already have an Account">
                        <Text style={styles.loginButton}>Login</Text>
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
    logoContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    logo: {
        width: 220,
        height: 100,
    },
    input: {
        height: 48,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 30,
    },
    buttonContainer: {
        marginTop: 20,
    },
    passwordResetButton: {
        backgroundColor: "#ff5a5f",
        paddingVertical: 12,
        borderRadius: 4,
        alignItems: "center",
    },
    passwordResetButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    registerContainer: {
        marginTop: 20,
        alignItems: "center",
    },
    loginButton: {
        color: 'green',
        marginLeft: 5,
    },
});

// src/screens/WelcomeScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import globalStyles from "../globalStyles"; // Estilos globales para textos y otros elementos
import AsyncStorage from "@react-native-async-storage/async-storage"; // Almacenamiento local
import { Ionicons } from "@expo/vector-icons"; // Íconos para mostrar/ocultar contraseña
import { loginCaseta } from "../services/AuthService"; // Servicio de autenticación

const WelcomeScreen = ({ navigation }) => {
  // Estados para manejar email, contraseña, carga, y visibilidad de contraseña
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Maneja el proceso de inicio de sesión
  const handleLogin = async () => {
    setLoading(true); // Activa el indicador de carga
    try {
      // Llama al servicio de autenticación con email y contraseña
      const data = await loginCaseta(email, password);
      if (data.data.isValid) {
        // Almacena el token del usuario en AsyncStorage
        await AsyncStorage.setItem("userToken", data.data.token);
        // Navega a la pantalla de escaneo de QR si las credenciales son válidas
        navigation.navigate("QRScan");
      } else {
        // Muestra un mensaje de error si las credenciales no son válidas
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      // Muestra un mensaje si hay un problema con el servidor o las credenciales
      Alert.alert(
        "Error",
        "Las credenciales ingresadas son incorrectas o hubo un problema con el servidor."
      );
    } finally {
      setLoading(false); // Desactiva el indicador de carga
    }
  };

  return (
    <View style={styles.container}>
      {/* Muestra un indicador de carga si loading es true */}
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0033cc" />
        </View>
      )}

      {/* Botón para regresar a la pantalla anterior */}
      <View style={styles.containerBack}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()} // Navega hacia atrás
        >
          <Text style={styles.backButtonText}>{"<"}</Text>
        </TouchableOpacity>
      </View>

      {/* Título de bienvenida */}
      <Text style={[globalStyles.textBold, styles.title]}>
        ¡Bienvenido de{"\n"}nuevo!
      </Text>

      {/* Campo de entrada para el correo electrónico */}
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu correo" // Texto de ejemplo
        placeholderTextColor="#aaa"
        value={email} // Estado de email
        onChangeText={setEmail} // Actualiza el estado de email
      />

      {/* Contenedor para la contraseña y su visibilidad */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Ingresa tu contraseña" // Texto de ejemplo
          placeholderTextColor="#aaa"
          secureTextEntry={!showPassword} // Oculta la contraseña si showPassword es false
          value={password} // Estado de password
          onChangeText={setPassword} // Actualiza el estado de password
        />

        {/* Botón para alternar la visibilidad de la contraseña */}
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye" : "eye-off"} // Cambia el ícono según showPassword
            size={24}
            color="#6A707C"
          />
        </TouchableOpacity>
      </View>

      {/* Texto para contraseña olvidada */}
      <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>

      {/* Botón para iniciar sesión */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={[globalStyles.textBold, styles.buttonText]}>
          Iniciar Sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa toda la pantalla
    backgroundColor: "#fff", // Fondo blanco
    padding: 20, // Espaciado interno
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject, // Cubre toda la pantalla
    backgroundColor: "rgba(255, 255, 255, 0.7)", // Fondo semitransparente
    justifyContent: "center", // Centra verticalmente
    alignItems: "center", // Centra horizontalmente
    zIndex: 1, // Se coloca sobre otros elementos
  },
  containerBack: {
    marginTop: 50, // Margen superior
    width: 50, // Ancho del botón
    height: 50, // Altura del botón
    borderColor: "#E8ECF4", // Color del borde
    borderWidth: 1, // Grosor del borde
    borderRadius: 10, // Bordes redondeados
    justifyContent: "center", // Centra verticalmente
    alignItems: "center", // Centra horizontalmente
  },
  backButtonText: {
    fontSize: 24, // Tamaño de la fuente
    color: "#1E232C", // Color del texto
  },
  title: {
    fontSize: 40, // Tamaño del título
    color: "#0033cc", // Color azul
    marginTop: 30, // Margen superior
    marginBottom: 40, // Margen inferior
  },
  inputPassword: {
    flex: 1, // Ocupa todo el ancho disponible
    padding: 15, // Espaciado interno
  },
  input: {
    width: "100%", // Ocupa el ancho completo
    padding: 15, // Espaciado interno
    borderRadius: 10, // Bordes redondeados
    backgroundColor: "#f5f5f5", // Fondo gris claro
    marginBottom: 15, // Margen inferior
  },
  passwordContainer: {
    flexDirection: "row", // Elementos en fila
    alignItems: "center", // Centra verticalmente
    backgroundColor: "#f5f5f5", // Fondo gris claro
    borderRadius: 10, // Bordes redondeados
    paddingHorizontal: 10, // Espaciado horizontal
    marginBottom: 15, // Margen inferior
  },
  forgotPasswordText: {
    alignSelf: "flex-end", // Alinea al final
    color: "#6A707C", // Color gris oscuro
    marginTop: 15, // Margen superior
    marginBottom: 20, // Margen inferior
  },
  button: {
    marginTop: 20, // Margen superior
    backgroundColor: "#0033cc", // Fondo azul
    padding: 15, // Espaciado interno
    borderRadius: 10, // Bordes redondeados
    alignItems: "center", // Centra el texto
  },
  buttonText: {
    color: "#fff", // Color del texto
    fontSize: 18, // Tamaño de la fuente
  },
});

export default WelcomeScreen; // Exporta el componente para ser usado en otras partes de la app

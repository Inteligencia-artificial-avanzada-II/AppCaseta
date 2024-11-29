import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Íconos para el diseño
import { CameraView, Camera } from "expo-camera"; // Componentes para manejar la cámara
import AsyncStorage from "@react-native-async-storage/async-storage"; // Para manejar el almacenamiento local
import { fetchOrderData } from "../services/OrdenService"; // Función para obtener datos de la orden

const QRScanScreen = ({ navigation }) => {
  // Estados para manejar permisos, escaneo, visibilidad del escáner y token del usuario
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [userToken, setUserToken] = useState("");

  // Efecto para solicitar permisos de la cámara y obtener el token del usuario
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted"); // Actualiza el estado según los permisos
    };

    getCameraPermissions(); // Llama a la función para obtener permisos
    fetchUserToken(); // Obtiene el token del usuario desde AsyncStorage
  }, []);

  // Efecto para ocultar el escáner después de un escaneo exitoso
  useEffect(() => {
    if (scanned) {
      setShowScanner(false); // Oculta el escáner si ya se escaneó algo
    }
  }, [scanned]);

  // Obtiene el token del usuario desde AsyncStorage
  const fetchUserToken = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken"); // Intenta obtener el token almacenado
      if (token) {
        setUserToken(token); // Almacena el token en el estado
      } else {
        console.error("No se encontró token en AsyncStorage");
      }
    } catch (error) {
      console.error("Error al obtener el token: ", error);
    }
  };

  // Maneja el evento de escaneo de código QR
  const handleBarcodeScanned = async ({ type, data }) => {
    setScanned(true); // Marca como escaneado
    console.log("Escaneado: ", data); // Imprime el valor escaneado en la consola

    try {
      // Obtiene los datos de la orden utilizando el servicio y el token del usuario
      const orderData = await fetchOrderData(data, userToken);

      if (orderData) {
        navigation.navigate("Order"); // Navega a la pantalla de orden si los datos son válidos
      } else {
        // Alerta si el código QR no es válido
        Alert.alert("Error", "El código QR no es válido", [
          {
            text: "OK",
            onPress: () => setScanned(false), // Restablece el estado para permitir un nuevo escaneo
          },
        ]);
      }
    } catch (error) {
      // Alerta si hay un error durante la validación
      Alert.alert("Error", "Hubo un problema con la validación del código QR", [
        {
          text: "OK",
          onPress: () => setScanned(false), // Restablece el estado para permitir un nuevo escaneo
        },
      ]);
    }
  };

  // Verifica el estado de los permisos de la cámara
  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>; // Muestra un mensaje mientras se solicita el permiso
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>; // Muestra un mensaje si no se concede el permiso
  }

  return (
    <View style={styles.container}>
      {/* Muestra la imagen de QR o el escáner dependiendo del estado */}
      {!showScanner ? (
        <View style={styles.qrContainer}>
          <Image source={require("../assets/Qr.png")} style={styles.qrImage} />
        </View>
      ) : (
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned} // Escanea si no ha sido escaneado previamente
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"], // Tipos de códigos admitidos
          }}
          style={StyleSheet.absoluteFillObject} // El escáner ocupa toda la pantalla
        />
      )}

      {/* Sección inferior con botón para activar el escáner */}
      {!showScanner && (
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7} // Opacidad al presionar
            onPress={() => setShowScanner(true)} // Activa el escáner al presionar
          >
            <Text style={styles.buttonText}>LEER QR</Text>
            <Ionicons
              name="arrow-forward-outline" // Ícono de flecha
              size={20}
              color="#000"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo el espacio disponible
    backgroundColor: "#fff", // Fondo blanco
    justifyContent: "center", // Centra verticalmente
    alignItems: "center", // Centra horizontalmente
  },
  qrContainer: {
    justifyContent: "center", // Centra verticalmente
    alignItems: "center", // Centra horizontalmente
    marginBottom: 50, // Margen inferior
    flex: 1, // Ocupa el espacio disponible
    width: "100%", // Ancho completo
  },
  qrImage: {
    width: 200, // Ancho de la imagen
    height: 200, // Altura de la imagen
  },
  bottomSection: {
    position: "absolute", // Posiciona al final de la pantalla
    bottom: 0, // Anclado al borde inferior
    width: "100%", // Ancho completo
    height: "25%", // Ocupa el 25% de la pantalla
    backgroundColor: "#001789", // Fondo azul
    borderTopLeftRadius: 40, // Bordes superiores redondeados
    borderTopRightRadius: 40,
    justifyContent: "center", // Centra el contenido verticalmente
    alignItems: "center", // Centra el contenido horizontalmente
  },
  button: {
    marginTop: 5, // Margen superior
    backgroundColor: "#fff", // Fondo blanco
    padding: 15, // Espaciado interno
    borderRadius: 10, // Bordes redondeados
    alignItems: "center", // Centra el texto
    flexDirection: "row", // Coloca los elementos en fila
    justifyContent: "center", // Centra los elementos en fila
    width: "80%", // Ancho relativo al contenedor
  },
  buttonText: {
    color: "#000", // Color del texto
    fontSize: 16, // Tamaño de la fuente
    fontWeight: "bold", // Texto en negrita
  },
  icon: {
    position: "absolute", // Posición absoluta dentro del botón
    right: 20, // Alineado a la derecha
  },
});

export default QRScanScreen; // Exporta el componente para su uso en otras partes de la app

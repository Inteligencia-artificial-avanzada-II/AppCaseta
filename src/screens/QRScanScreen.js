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
import { Ionicons } from "@expo/vector-icons";
import { CameraView, Camera } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchOrderData } from "../services/OrdenService"; // Importa la función desde el servicio

const QRScanScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [userToken, setUserToken] = useState("");

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
    fetchUserToken();
  }, []);

  useEffect(() => {
    if (scanned) {
      setShowScanner(false);
    }
  }, [scanned]);

  const fetchUserToken = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        setUserToken(token);
      } else {
        console.error("No se encontró token en AsyncStorage");
      }
    } catch (error) {
      console.error("Error al obtener el token: ", error);
    }
  };

  const handleBarcodeScanned = async ({ type, data }) => {
    setScanned(true);
    console.log("Escaneado: ", data);

    try {
      const orderData = await fetchOrderData(data, userToken);

      if (orderData) {
        navigation.navigate("Order");
      } else {
        Alert.alert("Error", "El código QR no es válido", [
          {
            text: "OK",
            onPress: () => setScanned(false),
          },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema con la validación del código QR", [
        {
          text: "OK",
          onPress: () => setScanned(false),
        },
      ]);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!showScanner ? (
        <View style={styles.qrContainer}>
          <Image source={require("../assets/Qr.png")} style={styles.qrImage} />
        </View>
      ) : (
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
          }}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      {!showScanner && (
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={() => setShowScanner(true)}
          >
            <Text style={styles.buttonText}>LEER QR</Text>
            <Ionicons
              name="arrow-forward-outline"
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
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  qrContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
    flex: 1,
    width: "100%",
  },
  qrImage: {
    width: 200,
    height: 200,
  },
  bottomSection: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "25%",
    backgroundColor: "#001789",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 5,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "80%",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    position: "absolute",
    right: 20,
  },
});

export default QRScanScreen;

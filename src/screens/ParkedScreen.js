import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const ParkedScreen = ({ route, navigation }) => {
  // Extrae el mensaje pasado como parámetro desde la pantalla anterior
  const { message } = route.params;

  return (
    <View style={styles.container}>
      {/* Icono de éxito */}
      <Image
        source={require("../assets/OK.png")} // Ruta del icono de confirmación
        style={styles.icon}
      />

      {/* Muestra el mensaje dinámico recibido como parámetro */}
      <Text style={styles.title}>{message}</Text>

      {/* Botón para regresar a la pantalla de escaneo QR */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("QRScan")} // Navega a la pantalla de escaneo QR
      >
        <Text style={styles.buttonText}>Inicio</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#0033cc",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    position: "absolute",
    bottom: 150,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ParkedScreen; // Exporta el componente para ser utilizado en otras partes de la app

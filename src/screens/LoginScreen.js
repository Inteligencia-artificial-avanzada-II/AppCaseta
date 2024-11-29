import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import globalStyles from "../globalStyles"; // Importa estilos globales compartidos

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Imagen de fondo utilizando ImageBackground */}
      <ImageBackground
        source={require("../assets/background.jpg")} // Ruta de la imagen de fondo
        style={styles.backgroundImage}
      >
        {/* Capa semitransparente para oscurecer la imagen de fondo */}
        <View style={styles.overlay} />

        {/* Contenedor principal del área de login */}
        <View style={styles.loginContainer}>
          {/* Logo principal */}
          <Image
            source={require("../assets/bimboLogo.png")} // Ruta del logo
            style={styles.logo}
          />
          {/* Botón de inicio de sesión */}
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.6} // Define la opacidad al presionar
            onPress={() => navigation.navigate("Welcome")} // Navega a la pantalla Welcome
          >
            <Text style={[globalStyles.textBold, styles.buttonText]}>
              Iniciar Sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo el espacio disponible
    backgroundColor: "#000", // Fondo negro para la pantalla
  },
  backgroundImage: {
    flex: 1, // La imagen de fondo ocupa todo el espacio
    justifyContent: "flex-end", // Alinea los elementos en la parte inferior
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Cubre todo el área de la imagen de fondo
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Fondo negro semitransparente
  },
  loginContainer: {
    backgroundColor: "#FFFFFF", // Fondo blanco del contenedor
    borderTopLeftRadius: 40, // Bordes superiores redondeados
    borderTopRightRadius: 40,
    alignItems: "center", // Centra los elementos horizontalmente
    padding: 5, // Espaciado interno
    height: "30%", // Ocupa el 30% de la pantalla
  },
  logo: {
    width: 169, // Ancho del logo
    height: 140, // Altura del logo
    marginBottom: 5, // Espacio debajo del logo
  },
  button: {
    backgroundColor: "#001789", // Color de fondo del botón
    padding: 15, // Espaciado interno del botón
    borderRadius: 10, // Bordes redondeados del botón
    width: "80%", // Ancho relativo al contenedor
    alignItems: "center", // Centra el texto dentro del botón
  },
  buttonText: {
    color: "#ffffff", // Color del texto
    fontSize: 18, // Tamaño de la fuente
    fontWeight: "bold", // Texto en negrita
  },
});

export default LoginScreen; // Exporta el componente para su uso en otras partes de la app

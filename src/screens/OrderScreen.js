import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Íconos para el diseño
import AsyncStorage from "@react-native-async-storage/async-storage"; // Para manejo de almacenamiento local
import { Acomodar } from "../services/AcomodarService"; // Servicio para realizar la acción de acomodar

const OrderScreen = ({ navigation }) => {
  // Estados para manejar la información de la orden
  const [orderId, setOrderId] = useState("");
  const [origen, setOrigen] = useState("");

  // Obtiene los datos de la orden almacenados en AsyncStorage
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const sqlData = await AsyncStorage.getItem("sqlData");
        if (sqlData) {
          const parsedData = JSON.parse(sqlData); // Convierte los datos almacenados en un objeto
          setOrderId(parsedData.idOrden); // Establece el ID de la orden
          setOrigen(parsedData.origen); // Establece el origen
        } else {
          console.error("No se encontró sqlData en AsyncStorage");
        }
      } catch (error) {
        console.error("Error al obtener el idOrden: ", error);
      }
    };
    fetchOrderData(); // Llama a la función al montar el componente
  }, []);

  // Maneja la acción de acomodar el contenedor
  const handleAcomodar = async () => {
    try {
      // Obtiene el ID del contenedor almacenado en AsyncStorage
      const idContenedor = JSON.parse(
        await AsyncStorage.getItem("idContenedor")
      );
      console.log("idContenedor:", idContenedor);

      if (!idContenedor) {
        // Muestra una alerta si no se encuentran los datos necesarios
        console.error("Faltan datos en AsyncStorage");
        Alert.alert(
          "Error",
          "No se encontraron los datos necesarios. Por favor, intente escanear el código QR nuevamente.",
          [{ text: "OK", onPress: () => navigation.navigate("QRScan") }]
        );
        return;
      }

      // Obtiene la fecha y hora local ajustada según la zona horaria
      const date = new Date();
      const offsetInMinutes = date.getTimezoneOffset(); // Obtiene el desfase respecto a UTC
      const localDateTime = new Date(
        date.getTime() - offsetInMinutes * 60000
      ).toISOString();

      // Llama al servicio para acomodar el contenedor
      const response = await Acomodar(idContenedor, localDateTime);

      console.log("Respuesta de Acomodar:", response);

      if (response.puerta && response.puerta.number) {
        // Navega a la pantalla de Parked si se asigna una puerta
        navigation.navigate("Parked", {
          message: `Camion acomodado en puerta ${response.puerta.number}`,
        });
      } else {
        // Navega a la pantalla de Parked si no se asigna una puerta
        navigation.navigate("Parked", {
          message: "Camion en espera de asignación de puerta",
        });
      }
    } catch (error) {
      // Muestra una alerta en caso de error
      console.error("Error en handleAcomodar:", error);
      Alert.alert("Error", "No se pudo acomodar, intente de nuevo.", [
        { text: "OK", onPress: () => navigation.navigate("QRScan") },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Cabecera de la pantalla con el título y número de la orden */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Orden</Text>
        <Text style={styles.orderNumber}># {orderId}</Text>
      </View>

      {/* Contenedor para los elementos de la orden */}
      <View style={styles.itemContainer}>
        {/* Muestra el origen de la orden */}
        <TouchableOpacity style={styles.item}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="document"
              size={20}
              color="#fff"
              style={styles.icon}
            />
          </View>
          <Text style={styles.itemText}>{origen}</Text>
        </TouchableOpacity>

        {/* Botón para navegar a la pantalla de productos */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate("Products")}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="basket"
              size={20}
              color="#fff"
              style={styles.icon}
            />
          </View>
          <Text style={styles.itemText}>Productos</Text>
        </TouchableOpacity>
      </View>

      {/* Botón principal para acomodar */}
      <TouchableOpacity style={styles.button} onPress={handleAcomodar}>
        <Text style={styles.buttonText}>Acomodar</Text>
      </TouchableOpacity>

      {/* Botón secundario para escanear otro QR */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("QRScan")}
      >
        <Text style={styles.secondaryButtonText}>Leer otro código QR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 40,
    marginTop: 150,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0033cc",
  },
  orderNumber: {
    fontSize: 16,
    color: "#000",
  },
  itemContainer: {
    marginBottom: 50,
    width: "100%",
  },
  item: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
    flexDirection: "row",
  },
  iconContainer: {
    backgroundColor: "#0033cc",
    borderRadius: 50,
    padding: 10,
    marginRight: 10,
  },
  itemText: {
    fontSize: 18,
  },
  button: {
    position: "absolute",
    bottom: 100,
    backgroundColor: "#0033cc",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    position: "absolute",
    bottom: 40,
    backgroundColor: "#ccc",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    alignSelf: "center",
  },
  secondaryButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OrderScreen; // Exporta el componente para ser utilizado en otras partes de la app

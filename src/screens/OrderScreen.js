import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Acomodar } from "../services/AcomodarService";

const OrderScreen = ({ navigation }) => {
  const [orderId, setOrderId] = useState("");
  const [origen, setOrigen] = useState("");

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const sqlData = await AsyncStorage.getItem("sqlData");
        if (sqlData) {
          const parsedData = JSON.parse(sqlData);
          setOrderId(parsedData.idOrden);
          setOrigen(parsedData.origen);
        } else {
          console.error("No se encontró sqlData en AsyncStorage");
        }
      } catch (error) {
        console.error("Error al obtener el idOrden: ", error);
      }
    };
    fetchOrderData();
  }, []);

  const handleAcomodar = async () => {
    try {
      const idContenedor = JSON.parse(
        await AsyncStorage.getItem("idContenedor")
      );
      console.log("idContenedor:", idContenedor);

      if (!idContenedor) {
        console.error("Faltan datos en AsyncStorage");
        Alert.alert(
          "Error",
          "No se encontraron los datos necesarios. Por favor, intente escanear el código QR nuevamente.",
          [{ text: "OK", onPress: () => navigation.navigate("QRScan") }]
        );
        return;
      }

      const date = new Date();
      const offsetInMinutes = date.getTimezoneOffset(); // Obtiene el desfase en minutos respecto a UTC
      const localDateTime = new Date(
        date.getTime() - offsetInMinutes * 60000
      ).toISOString();
      const response = await Acomodar(idContenedor, localDateTime);

      console.log("Respuesta de Acomodar:", response);

      if (response.puerta && response.puerta.number) {
        // Si hay una puerta asignada, navega a ParkedScreen con el número de puerta
        navigation.navigate("Parked", {
          message: `Camion acomodado en puerta ${response.puerta.number}`,
        });
      } else {
        // Si no hay puerta asignada, muestra mensaje de espera
        navigation.navigate("Parked", {
          message: "Camion en espera de asignación de puerta",
        });
      }
    } catch (error) {
      console.error("Error en handleAcomodar:", error);
      Alert.alert("Error", "No se pudo acomodar, intente de nuevo.", [
        { text: "OK", onPress: () => navigation.navigate("QRScan") },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Orden</Text>
        <Text style={styles.orderNumber}># {orderId}</Text>
      </View>

      <View style={styles.itemContainer}>
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

      <TouchableOpacity style={styles.button} onPress={handleAcomodar}>
        <Text style={styles.buttonText}>Acomodar</Text>
      </TouchableOpacity>

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

export default OrderScreen;

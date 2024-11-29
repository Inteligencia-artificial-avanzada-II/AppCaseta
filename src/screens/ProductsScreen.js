import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Manejo de almacenamiento local
import { Ionicons } from "@expo/vector-icons"; // Íconos para mejorar la interfaz

const ProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]); // Estado para almacenar la lista de productos

  // Carga los productos almacenados en AsyncStorage al montar el componente
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const storedProducts = await AsyncStorage.getItem("products");
        if (storedProducts) {
          setProducts(JSON.parse(storedProducts)); // Convierte los productos en un objeto y actualiza el estado
        } else {
          Alert.alert("Error", "No se encontraron productos almacenados."); // Alerta si no hay productos
        }
      } catch (error) {
        console.error("Error al cargar los productos: ", error); // Log de error
        Alert.alert("Error", "Hubo un problema al cargar los productos."); // Alerta en caso de error
      }
    };

    loadProducts();
  }, []);

  // Renderiza cada producto en la lista
  const renderItem = ({ item, index }) => (
    <View style={styles.item}>
      {/* Ícono con color alternado según el índice del producto */}
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: index % 2 === 0 ? "#0033cc" : "#ff0000" },
        ]}
      >
        <Ionicons name="cube" size={20} color="#fff"></Ionicons>
      </View>
      {/* Descripción del producto */}
      <Text style={styles.itemText}>{item.itemDescription}</Text>
      {/* Cantidad solicitada y unidad de medida */}
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityText}>{item.requestedQuantity}</Text>
        <Text style={styles.unitText}>{item.unitOfMeasure}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Cabecera con botón para regresar y título */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()} // Navega hacia atrás
          style={styles.backButton}
        >
          <Ionicons name="arrow-undo-circle" size={35} color="#0033cc" />
        </TouchableOpacity>
        <Text style={styles.title}>Products</Text>
      </View>

      {/* Lista de productos utilizando FlatList */}
      <FlatList
        data={products} // Datos de la lista
        keyExtractor={(item, index) => index.toString()} // Clave única para cada elemento
        renderItem={renderItem} // Componente que renderiza cada producto
        contentContainerStyle={styles.itemContainer} // Estilo para el contenedor
      />
    </View>
  );
};

export default ProductsScreen; // Exporta el componente para su uso en otras partes de la app

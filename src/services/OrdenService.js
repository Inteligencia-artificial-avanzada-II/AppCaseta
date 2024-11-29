import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Para manejar almacenamiento local
import { BASE_URL } from "@env"; // URL base desde las variables de entorno

/**
 * Función para obtener los datos de una orden mediante un código QR.
 * @param {string} data - Código QR escaneado que contiene información de la orden.
 * @param {string} userToken - Token de autenticación del usuario.
 * @returns {Object} - Información de la orden obtenida del servidor.
 * @throws {Error} - Lanza un error si la solicitud falla.
 */
export const fetchOrderData = async (data, userToken) => {
  try {
    // Realiza una solicitud GET al endpoint para consultar datos de la orden
    const response = await axios.get(`${BASE_URL}/orden/consultarqr/${data}`, {
      headers: {
        Authorization: `Token ${userToken}`, // Agrega el token del usuario en los encabezados
      },
    });

    // Extrae los datos relevantes de la respuesta
    const products = response.data.data.mongoData.products; // Productos asociados a la orden
    const sqlData = response.data.data.sqlData; // Datos SQL asociados a la orden
    const idContenedor = sqlData.idContenedor; // ID del contenedor relacionado con la orden

    // Almacena los datos relevantes en AsyncStorage para uso posterior
    await AsyncStorage.setItem("sqlData", JSON.stringify(sqlData));
    await AsyncStorage.setItem("products", JSON.stringify(products));
    await AsyncStorage.setItem("idContenedor", JSON.stringify(idContenedor));

    // Retorna toda la información relevante de la orden
    return response.data.data;
  } catch (error) {
    // Manejo de errores: registra el error y lanza una excepción para manejo externo
    console.error("Error fetching order data:", error);
    throw error;
  }
};

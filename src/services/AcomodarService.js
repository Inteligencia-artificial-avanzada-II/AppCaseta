import axios from "axios";
import { BASE_URL } from "@env"; // URL base desde las variables de entorno
import AsyncStorage from "@react-native-async-storage/async-storage"; // Manejo de almacenamiento local

/**
 * Función para acomodar un contenedor llamando a un endpoint específico.
 * @param {string} idContenedor - ID del contenedor que se desea acomodar.
 * @param {string} dateTime - Fecha y hora en formato ISO para el registro.
 * @returns {Object} - Respuesta del servidor con los detalles del proceso de acomodación.
 * @throws {Error} - Lanza un error si la solicitud falla.
 */
export const Acomodar = async (idContenedor, dateTime) => {
  try {
    // Logs para verificar los parámetros recibidos
    console.log("idContenedor", idContenedor);
    console.log("dateTime", dateTime);

    // Obtiene el token del usuario desde AsyncStorage
    const token = await AsyncStorage.getItem("userToken");
    console.log("token", token);

    // Construye la URL para la solicitud
    const url = `${BASE_URL}/puerta/acomodar`;
    console.log("url", url);

    // Realiza la solicitud POST al endpoint con los datos requeridos
    const response = await axios.post(
      url,
      {
        dateTime: dateTime, // Fecha y hora del registro
        idContenedor: idContenedor, // ID del contenedor
      },
      {
        headers: {
          Authorization: `Token ${token}`, // Token para la autorización
        },
      }
    );

    // Retorna los datos de la respuesta
    return response.data;
  } catch (error) {
    // Log de errores y lanzamiento del mismo para manejarlo en el llamado
    console.error("Error en Acomodar:", error);
    throw error;
  }
};

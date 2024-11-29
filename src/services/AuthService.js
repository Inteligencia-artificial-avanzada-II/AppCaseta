// src/services/AuthService.js
import axios from "axios";
import { BASE_URL } from "@env"; // URL base obtenida de las variables de entorno

/**
 * Función para realizar el inicio de sesión en la caseta.
 * @param {string} email - Correo electrónico o nombre de usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Object} - Respuesta del servidor con la información de autenticación.
 * @throws {Error} - Lanza un error si la solicitud falla.
 */
export const loginCaseta = async (email, password) => {
  try {
    // Realiza una solicitud POST al endpoint de inicio de sesión
    const response = await axios.post(`${BASE_URL}/usuario/loginCaseta`, {
      userName: email, // Nombre de usuario enviado al servidor
      contraseña: password, // Contraseña enviada al servidor
    });

    // Retorna los datos de la respuesta en caso de éxito
    return response.data;
  } catch (error) {
    // Registra el error en la consola y lo lanza nuevamente para manejarlo externamente
    console.error("Error en loginCaseta:", error);
    throw error;
  }
};

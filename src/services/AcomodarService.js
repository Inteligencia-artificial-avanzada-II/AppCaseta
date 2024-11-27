import axios from "axios";
import { BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Acomodar = async (idContenedor, dateTime) => {
  try {
    console.log("idContenedor", idContenedor);
    console.log("dateTime", dateTime);
    const token = await AsyncStorage.getItem("userToken");
    console.log("token", token);
    const url = `${BASE_URL}/puerta/acomodar`;
    console.log("url", url);

    const response = await axios.post(
      url,
      {
        dateTime: dateTime,
        idContenedor: idContenedor,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error en Acomodar:", error);
    throw error;
  }
};

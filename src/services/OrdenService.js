import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@env";

export const fetchOrderData = async (data, userToken) => {
  try {
    const response = await axios.get(`${BASE_URL}/orden/consultarqr/${data}`, {
      headers: {
        Authorization: `Token ${userToken}`,
      },
    });

    const products = response.data.data.mongoData.products;
    const sqlData = response.data.data.sqlData;

    await AsyncStorage.setItem("sqlData", JSON.stringify(sqlData));
    await AsyncStorage.setItem("products", JSON.stringify(products));

    return response.data.data;
  } catch (error) {
    console.error("Error fetching order data:", error);
    throw error;
  }
};

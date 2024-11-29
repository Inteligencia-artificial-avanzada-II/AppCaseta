// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native"; // Contenedor principal para la navegación
import { createStackNavigator } from "@react-navigation/stack"; // Crea un stack de navegación
import LoginScreen from "./src/screens/LoginScreen"; // Pantalla de inicio de sesión
import WelcomeScreen from "./src/screens/WelcomeScreen"; // Pantalla de bienvenida
import QRScanScreen from "./src/screens/QRScanScreen"; // Pantalla para escanear QR
import OrderScreen from "./src/screens/OrderScreen"; // Pantalla para ver la orden
import ParkedScreen from "./src/screens/ParkedScreen"; // Pantalla de confirmación o estado del camión
import ProductsScreen from "./src/screens/ProductsScreen"; // Pantalla para listar productos

const Stack = createStackNavigator(); // Inicializa el stack de navegación

export default function App() {
  return (
    <NavigationContainer>
      {/* Configuración del stack de navegación */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Rutas de la aplicación, cada una vinculada a un componente */}
        <Stack.Screen name="Login" component={LoginScreen} /> {/* Pantalla de inicio de sesión */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} /> {/* Pantalla de bienvenida */}
        <Stack.Screen name="QRScan" component={QRScanScreen} /> {/* Pantalla para escanear un QR */}
        <Stack.Screen name="Order" component={OrderScreen} /> {/* Pantalla para visualizar los datos de la orden */}
        <Stack.Screen name="Parked" component={ParkedScreen} /> {/* Pantalla de confirmación */}
        <Stack.Screen name="Products" component={ProductsScreen} /> {/* Pantalla que lista los productos */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

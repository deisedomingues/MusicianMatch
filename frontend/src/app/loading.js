import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Loading() {
  useEffect(() => {
    async function verificarUsuario() {
      const tipo = await AsyncStorage.getItem("tipoUsuario");

      if (tipo === "musico") {
        router.replace("/(tabs-musician)/home");
      } else if (tipo === "contratante") {
        router.replace("/(tabs-contractor)/home");
      } 
      
    }
    verificarUsuario();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
      }}
    >
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}

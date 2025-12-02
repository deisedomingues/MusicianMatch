import { Slot, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const json = await AsyncStorage.getItem("userData");

      if (!json) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(json);

      // Redireciona baseado no tipo
      if (user.tipo === "musico") {
        console.log("musico");

        router.replace("/(tabs-musician)/home");
      } else if (user.tipo === "comum") {
        console.log("musico");

        router.replace("/(tabs-contractor)/home");
      } else {
        console.log("login");

        router.replace("/auth/login");
      }

      setLoading(false);
    }

    checkUser();
  }, []);

  return (
    <>
      <Slot />
      <Toast />
    </>
  );
}

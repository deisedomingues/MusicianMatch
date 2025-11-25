import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import * as Animatable from "react-native-animatable";
import backgroundSplash from "./assets/background-splash.png";

export default function Index() {
  function Login() {
    router.push("/auth/login"); // corrigido
  }

  return (
    <View style={styles.containerBackground}>
      <View style={styles.container}>
        <ImageBackground source={backgroundSplash} style={styles.image}>
          <Animatable.View
            delay={300}
            animation="fadeInUp"
            style={styles.containerForm}
          >
            <LinearGradient
              colors={[
                "rgba(43, 43, 43, 0.07)",
                "rgba(32, 32, 32, 0.95)",
                "rgba(0, 0, 0, 1)",
              ]}
              style={{ flex: 1, padding: "5%", paddingBottom: 32 }}
            >
              <Text style={styles.title}>Encontre o</Text>
              <Text style={styles.title_bold}>musicista perfeito.</Text>
              <Text style={styles.text}>
                Seja para contratar os melhores talentos para seu evento ou para
                você, músico, conquistar novos palcos.
              </Text>

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.button}
                onPress={Login}
              >
                <Text style={styles.label}>Acessar</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animatable.View>
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerBackground: {
    flex: 1,
    width: "100%",
    backgroundColor: "#141414ff",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 375, // corrigido
  },
  image: {
    flex: 1,
    width: "100%",
    height: "110%",
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  containerForm: {
    flex: 1,
    maxHeight: 400,
    position: "absolute",
    bottom: 0,
  },
  title: {
    color: "#fff",
    fontSize: 35,
    fontWeight: "normal", // corrigido
    marginTop: 28,
  },
  title_bold: {
    color: "#fff",
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 12,
  },
  text: {
    color: "#a1a1a1",
    fontSize: 18,
  },
  label: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "normal", // corrigido
  },
  button: {
    backgroundColor: "#8F16A7",
    borderRadius: 4,
    width: "100%",
    height: 48,
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});

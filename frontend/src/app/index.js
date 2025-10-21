import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import React from "react";
import * as Animatable from "react-native-animatable";

export default function Index() {
  function Login() {
    router.navigate("/auth/login");
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerLogo}>
        <Animatable.Image
          animation="flipInY"
          source={require("./assets/logo.png")}
          style={{ width: "100%" }}
          resizeMode="contain"
        />
      </View>
      <Animatable.View
        delay={600}
        animation="fadeInUp"
        style={styles.containerForm}
      >
        <Text style={styles.title}>
          Onde a música encontra a parceria ideal!
        </Text>
        <Text style={styles.text}>Faça o login para começar</Text>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.button}
          onPress={Login}
        >
          <Text style={styles.label}>Acessar</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#871F78",
  },
  containerLogo: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  containerForm: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: "5%",
    paddingEnd: "5%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 28,
    marginBottom: 12,
  },
  text: {
    color: "#a1a1a1",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    position: "absolute",
    backgroundColor: "#871F78",
    paddingVertical: 8,
    borderRadius: 50,
    width: "60%",
    alignSelf: "center",
    bottom: "15%",
    alignItems: "center",
    justifyContent: "center",
  },
  acessar: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

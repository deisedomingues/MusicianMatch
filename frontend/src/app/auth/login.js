import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useState } from "react";
import api from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function Login() {
  const { name } = useLocalSearchParams();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const recuperarSenha = () => {
    router.push("/auth/recuperar-senha");
  };

  function voltar() {
    router.back();
  }

  const enviaLogin = async () => {
    if (!email || !senha) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    setErro("");

    const emailValido =
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;

    if (!emailValido.test(email)) {
      Toast.show({
        type: "error",
        text1: "Validação",
        text2: "Por favor, insira um email válido.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/login", { email, senha });
      const { usuario, token } = response.data;

      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userData", JSON.stringify(usuario));

      Toast.show({
        type: "success",
        text1: "Login realizado",
        text2: "Bem vindo(a)!",
      });

      if (usuario.tipo === "musico") {
        router.replace("/(tabs-musician)/home");
      } else {
        router.replace("/(tabs-contractor)/home");
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Erro no login",
        text2: "Verifique seus dados e tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Animatable.View animation="fadeInDown" style={styles.header}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={300} style={styles.form}>
            <Text style={styles.title}>Acessar plataforma</Text>
            <Text style={styles.subtitle}>
              Encontre sua banda. Encontre sua parceria.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#B0B0B0"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#B0B0B0"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />

            {erro ? <Text style={styles.error}>{erro}</Text> : null}

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Não tem uma conta? </Text>
              <TouchableOpacity onPress={() => router.push("/auth/register")}>
                <Text style={styles.registerLink}>Cadastrar →</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={enviaLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
  },
  logo: {
    width: 220,
    height: 80,
  },
  form: {
    width: "100%",
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    padding: 25,
  },
  title: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 6,
  },
  subtitle: {
    color: "#B0B0B0",
    fontSize: 14,
    marginBottom: 25,
  },
  input: {
    backgroundColor: "#2A2A2A",
    borderRadius: 6,
    padding: 12,
    color: "#fff",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#3E3E3E",
  },
  button: {
    backgroundColor: "#871F78",
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    color: "#ff4d4d",
    textAlign: "center",
    marginBottom: 10,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  registerText: {
    color: "#B0B0B0",
    fontSize: 14,
  },
  registerLink: {
    color: "#A060FF",
    fontWeight: "bold",
    fontSize: 14,
  },
});

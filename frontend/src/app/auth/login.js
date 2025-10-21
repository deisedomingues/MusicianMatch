import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import api from "../api/api";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      alert("Por favor, insira um email válido.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/login", { email, senha });
      const { usuario, token } = response.data;

      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userData", JSON.stringify(usuario));

      router.replace("/(tabs)/home");
    } catch (error) {
      console.error(error);
      alert("Erro no login. Verifique seus dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#1E1E1E", "#473CA6", "#2F253E"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Animatable.View
          animation="fadeInLeft"
          delay={500}
          style={styles.cabecalho}
        >
          <Text style={styles.logo}>Musician&Match</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" style={styles.areaFormulario}>
          <View style={styles.inputContainer}>
            <FontAwesome
              name={"at"}
              size={30}
              color={"#ffff"}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="E-mail"
              placeholderTextColor="#FFFFFF80"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome
              name={"lock"}
              size={30}
              color={"#ffff"}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Senha"
              value={senha}
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              onChangeText={setSenha}
              secureTextEntry
            />
          </View>

          <Text style={styles.textoEsqueceuSenha} onPress={recuperarSenha}>
            Esqueceu sua senha?
          </Text>

          {erro !== "" && (
            <Text
              style={{ color: "red", textAlign: "center", marginBottom: 10 }}
            >
              {erro}
            </Text>
          )}

          <TouchableOpacity style={styles.botaoLogin} onPress={enviaLogin}>
            <Text style={styles.textoBotaoLogin}>
              {loading ? "Acessando..." : "Acessar"}
            </Text>
          </TouchableOpacity>

          <View style={styles.divisorContainer}>
            <View style={styles.bolinha} />
            <View style={styles.linha} />
            <View style={styles.bolinha} />
          </View>

          <TouchableOpacity style={styles.botaoGoogle}>
            <FontAwesome name="google" size={30} color="#fff" />
            <Text style={styles.textoBotaoGoogle}>Acessar com Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoCadastro}
            onPress={() => router.push("/auth/register")}
          >
            <Text style={styles.textoCadastro}>
              Não possui uma conta?{" "}
              <Text style={styles.textoCadastreSe}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </Animatable.View>

        <TouchableOpacity style={styles.botaoVoltar} onPress={voltar}>
          <Text>{name}</Text>
          <Text style={styles.textoBotaoVoltar}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    marginTop: "14%",
    marginBottom: "8%",
  },
  logo: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 50,
  },
  areaFormulario: {
    flex: 2,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: "8%",
    paddingEnd: "8%",
    paddingHorizontal: "8%",
  },
  botaoLogin: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 25,
    paddingVertical: 15,
    marginTop: 14,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  textoBotaoLogin: {
    color: "#463BA2",
    fontSize: 18,
    fontWeight: "bold",
  },
  botaoGoogle: {
    backgroundColor: "transparent",
    width: "100%",
    borderWidth: 1,
    borderRadius: 25,
    borderColor: "#fff",
    paddingVertical: 15,
    marginTop: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  textoBotaoGoogle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 60,
  },
  botaoVoltar: {
    backgroundColor: "#fff",
    width: "25%",
    borderRadius: 15,
    paddingVertical: 8,
    marginTop: 14,
    marginBottom: 14,
    marginLeft: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  textoBotaoVoltar: {
    color: "#871F78",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  botaoCadastro: {
    marginTop: 14,
    alignSelf: "center",
  },
  textoCadastro: {
    color: "#c3c3c3",
    fontWeight: "bold",
  },
  textoCadastreSe: {
    color: "#fff",
  },
  textoEsqueceuSenha: {
    color: "#c3c3c3",
    fontSize: 14,
    fontWeight: "bold",
    marginStart: "8%",
  },
  inputContainer: {
    backgroundColor: "rgba(38, 0, 0, 0.2)",
    flexDirection: "row",
    borderRadius: 25,
    marginVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    height: 60,
    elevation: 65,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  inputIcon: {
    marginLeft: 15,
  },
  textInput: {
    flex: 1,
    paddingLeft: 15,
    color: "#fff", // Texto de email e senha alterados para branco
  },
  bolinha: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  linha: {
    flex: 1,
    height: 1,
    backgroundColor: "#fff",
    opacity: 0.4,
  },
  divisorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: 20,
  },
});

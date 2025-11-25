import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import * as Animatable from "react-native-animatable";
import api from "../api/api";
import Toast from "react-native-toast-message";

export default function Register() {
  const [tipo, setTipo] = useState("comum");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [instrumentos, setInstrumentos] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validateCPF = (cpf) => cpf.length === 11 && !isNaN(cpf);

  const showError = (msg) => {
    Toast.show({
      type: "error",
      text1: "Erro",
      text2: msg,
    });
  };

  const showSuccess = (msg) => {
    Toast.show({
      type: "success",
      text1: "Sucesso",
      text2: msg,
    });
  };

  const cadastrar = async () => {
    if (!nome || !email || !telefone || !senha || !confirmarSenha || !cpf) {
      showError("Por favor, preencha todos os campos.");
      return;
    }

    if (senha.length < 6) {
      showError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      showError("As senhas não coincidem.");
      return;
    }

    if (!validateEmail(email)) {
      showError("Por favor, insira um e-mail válido.");
      return;
    }

    if (!validateCPF(cpf)) {
      showError("Por favor, insira um CPF válido.");
      return;
    }

    setErro("");
    setLoading(true);

    try {
      await api.post("/register", {
        nome,
        email,
        telefone,
        senha,
        cpf,
        tipo,
        ...(tipo === "musico" && { instrumentos, localizacao, descricao }),
      });

      showSuccess("Cadastro realizado com sucesso!");

      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (error) {
      console.error(error);
      showError("Erro ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Animatable.View animation="fadeInDown" style={styles.header}>
              <Text style={styles.title}>Crie sua conta</Text>
              <Text style={styles.subtitle}>
                Conecte-se a músicos e contratantes na plataforma
              </Text>
            </Animatable.View>

            <Animatable.View
              animation="fadeInUp"
              delay={300}
              style={styles.form}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.label}>Tipo de Usuário</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={tipo}
                    onValueChange={(v) => setTipo(v)}
                    style={styles.picker}
                    dropdownIconColor="#A060FF"
                    itemStyle={
                      Platform.OS === "ios"
                        ? { fontSize: 16, color: "#fff" }
                        : {}
                    }
                  >
                    <Picker.Item label="Comum" value="comum" />
                    <Picker.Item label="Músico" value="musico" />
                  </Picker>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Nome completo"
                  placeholderTextColor="#B0B0B0"
                  value={nome}
                  onChangeText={setNome}
                />
                <TextInput
                  style={styles.input}
                  placeholder="E-mail"
                  placeholderTextColor="#B0B0B0"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Telefone"
                  placeholderTextColor="#B0B0B0"
                  keyboardType="phone-pad"
                  value={telefone}
                  onChangeText={setTelefone}
                />
                <TextInput
                  style={styles.input}
                  placeholder="CPF"
                  placeholderTextColor="#B0B0B0"
                  keyboardType="numeric"
                  value={cpf}
                  onChangeText={setCpf}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Senha"
                  placeholderTextColor="#B0B0B0"
                  secureTextEntry
                  value={senha}
                  onChangeText={setSenha}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar senha"
                  placeholderTextColor="#B0B0B0"
                  secureTextEntry
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                />

                {tipo === "musico" && (
                  <>
                    <TextInput
                      style={styles.input}
                      placeholder="Instrumentos que toca"
                      placeholderTextColor="#B0B0B0"
                      value={instrumentos}
                      onChangeText={setInstrumentos}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Localização (cidade/bairro)"
                      placeholderTextColor="#B0B0B0"
                      value={localizacao}
                      onChangeText={setLocalizacao}
                    />
                    <TextInput
                      style={[styles.input, { height: 80 }]}
                      placeholder="Fale um pouco sobre você"
                      placeholderTextColor="#B0B0B0"
                      value={descricao}
                      onChangeText={setDescricao}
                      multiline
                    />
                  </>
                )}

                {erro ? <Text style={styles.error}>{erro}</Text> : null}

                <TouchableOpacity
                  style={styles.button}
                  onPress={cadastrar}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Cadastrar</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Já tem uma conta? </Text>
                  <TouchableOpacity onPress={() => router.push("/auth/login")}>
                    <Text style={styles.loginLink}>Faça login →</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </Animatable.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#B0B0B0",
    fontSize: 14,
    marginTop: 4,
  },
  form: {
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    padding: 25,
    marginBottom: 20,
  },
  label: {
    color: "#B0B0B0",
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: "#2A2A2A",
    borderRadius: 6,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#3E3E3E",
    paddingHorizontal: Platform.OS === "ios" ? 10 : 0,
  },
  picker: {
    color: "#fff",
    backgroundColor: "#2A2A2A",
    height: 48,
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
    marginTop: 10,
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  loginText: {
    color: "#B0B0B0",
    fontSize: 14,
  },
  loginLink: {
    color: "#A060FF",
    fontWeight: "bold",
    fontSize: 14,
  },
});

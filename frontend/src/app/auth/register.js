import { router } from "expo-router";
import { SafeAreaView, View, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import { useState } from "react";
import api from "../api/api";
import { Picker } from "@react-native-picker/picker"; // Lembre-se de instalar: expo install @react-native-picker/picker
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from "@expo/vector-icons";

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

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validateCPF = (cpf) => cpf.length === 11 && !isNaN(cpf);

  const cadastrar = async () => {
    if (!nome || !email || !telefone || !senha || !confirmarSenha || !cpf) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (senha.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }

    if (!validateCPF(cpf)) {
      alert("Por favor, insira um CPF válido.");
      return;
    }

    try {
      await api.post("/register", {
        nome,
        email,
        telefone,
        senha,
        cpf,
        tipo,
      });

      if (tipo === "musico") {
        await api.post("/register-musico", {
          cpf_usuario: cpf,
          instrumentos,
          localizacao,
          descricao,
        });
      }

      alert("Cadastro realizado com sucesso!");
      router.push("/auth/login");
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar. Tente novamente.");
    }
  };

  return (
    <LinearGradient colors={["#1E1E1E", "#473CA6", "#2F253E"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Animatable.View animation="fadeInLeft" delay={500} style={styles.cabecalho}>
          <Text style={styles.mensagem}>Cadastro</Text>
        </Animatable.View>

        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
          <Animatable.View animation="fadeInUp" style={styles.containerFormulario}>
            <Text style={styles.titulo}>Tipo</Text>

            <View style={styles.inputContainer1}>
              <Picker
                selectedValue={tipo}
                onValueChange={(itemValue) => setTipo(itemValue)}
                style={styles.picker}
                dropdownIconColor="#fff"
                mode="dropdown"
              >
                <Picker.Item label="Comum" value="comum" />
                <Picker.Item label="Músico" value="musico" />
              </Picker>
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome name={"user"} size={30} color={"#ffff"} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={nome}
                onChangeText={setNome}
                placeholderTextColor="#FFFFFF80"
                placeholder="Digite seu nome"
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome name={"envelope"} size={30} color={"#ffff"} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={cpf}
                onChangeText={setCpf}
                placeholder="Digite seu CPF"
                placeholderTextColor="#FFFFFF80"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome name={"phone"} size={30} color={"#ffff"} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={telefone}
                onChangeText={setTelefone}
                placeholder="Digite seu telefone"
                placeholderTextColor="#FFFFFF80"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome name={"user"} size={30} color={"#ffff"} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="Digite seu email"
                placeholderTextColor="#FFFFFF80"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.rowContainer}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <FontAwesome name={"lock"} size={30} color={"#ffff"} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={senha}
                  onChangeText={setSenha}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#FFFFFF80"
                  secureTextEntry
                />
              </View>

              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <TextInput
                  style={styles.textInput}
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  placeholder="Confirme sua senha"
                  placeholderTextColor="#FFFFFF80"
                  secureTextEntry
                />
              </View>
            </View>

            {tipo === "musico" && (
              <>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={instrumentos}
                    onChangeText={setInstrumentos}
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    placeholder="Quais instrumentos você toca?"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={localizacao}
                    onChangeText={setLocalizacao}
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    placeholder="Sua cidade ou bairro"
                  />
                </View> 

                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.textInput, { height: 80 }]}
                    value={descricao}
                    onChangeText={setDescricao}
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    placeholder="Fale um pouco sobre você"
                    multiline
                  />
                </View>
              </>
            )}

            <TouchableOpacity style={styles.botaoCadastro} onPress={cadastrar}>
              <Text style={styles.textoBotaoCadastro}>Cadastrar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkLogin} onPress={() => router.push("/auth/login")}>
              <Text style={styles.textoLogin}>
                Já tem uma conta? <Text style={styles.linkLoginTexto}>Faça login</Text>
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// Styles
const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  cabecalho: {
    marginTop: "14%",
    marginBottom: "8%",
    paddingStart: "5%",
  },
  mensagem: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  containerFormulario: {
    flex: 2,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: "8%",
    paddingEnd: "8%",
    paddingHorizontal: "8%",
  },
  titulo: {
    fontSize: 20,
    marginTop: 25,
    color: "#c3c3c3",
    fontWeight: "bold",
  },
  botaoCadastro: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 25,
    paddingVertical: 15,
    marginTop: 14,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  textoBotaoCadastro: {
    color: "#463BA2",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkLogin: {
    marginTop: 20,
    alignSelf: "center",
  },
  textoLogin: {
    color: "#c3c3c3",
    fontWeight: "bold",
  },
  linkLoginTexto: {
    color: "#871F78",
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

    // iOS shadow
    shadowColor: "#000",              
    shadowOffset: { width: 0, height: 4 },  
    shadowOpacity: 0.3,               
    shadowRadius: 6,
  },
  inputContainer1: {
    backgroundColor: "rgba(38, 0, 0, 0.2)",
    flexDirection: "row",
    borderRadius: 25,
    marginVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    height: 60,
    elevation: 65,
    width: "50%",

    // iOS shadow
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
    color: "#fff",
  },
  pickerContainer: {
    backgroundColor: "rgba(38, 0, 0, 0.2)", 
    borderRadius: 25, 
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 60, 
    justifyContent: "center",
  },
  picker: {
    color: "#fff", 
    fontSize: 18,
    height: 40, 
    backgroundColor: "transparent",
  },
  pickerItem: {
    fontSize: 18,
    color: "#fff",
  },
});

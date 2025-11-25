import { router } from "expo-router"; 
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native"; 
import * as Animatable from "react-native-animatable"; // Animações
import axios from "axios"; 
import { useState } from "react";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Função chamada quando o botão "Enviar" é pressionado
  const enviaRecuperacao = async () => {
    if (!email) {
      alert("Por favor, insira seu email.");
      return;
    }

    const emailValido = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailValido.test(email)) {
      alert("Por favor, insira um email válido."); 
      return;
    }

    setCarregando(true); 

    try {
      // Faz a requisição POST para a rota de recuperação de senha
      const response = await axios.post("http://192.168.58.167:3000/recuperar-senha", {
        email,
      });

      console.log(response.data); 
      alert("Instruções de recuperação de senha enviadas com sucesso."); 
      router.push("/auth/login"); // Direciona para a tela de login
    } catch (error) {
      console.error(error); 
      alert("Erro ao enviar solicitação de recuperação. Tente novamente."); 
    } finally {
      setCarregando(false); // Finaliza o carregamento
    }
  };

  // Voltar para a tela anterior
  const voltar = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
  
      <Animatable.View animation="fadeInLeft" delay={500} style={styles.cabecalho}>
        <Text style={styles.mensagem}>Recuperar Senha</Text>
      </Animatable.View>
     
      <Animatable.View animation="fadeInUp" style={styles.containerFormulario}>
        <Text style={styles.titulo}>Email</Text>
        <TextInput
          placeholder="Digite seu email cadastrado"
          style={styles.campoEntrada}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TouchableOpacity style={styles.botao} onPress={enviaRecuperacao}>
          <Text style={styles.textoBotao}>
            {carregando ? "Enviando..." : "Enviar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoVoltar} onPress={voltar}>
          <Text style={styles.textoVoltar}>Voltar para Login</Text>
        </TouchableOpacity>
      </Animatable.View>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#871F78", 
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
    backgroundColor: "#fff",
    flex: 1,
    borderTopLeftRadius: 25, 
    borderTopRightRadius: 25, 
    paddingStart: "5%",
    paddingEnd: "5%",
  },
  titulo: {
    fontSize: 20,
    marginTop: 25,
  },
  campoEntrada: {
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16,
  },
  botao: {
    backgroundColor: "#871F78", 
    width: "100%",
    borderRadius: 10,
    paddingVertical: 8, 
    marginTop: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  textoBotao: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  botaoVoltar: {
    marginTop: 14,
    alignSelf: "center",
  },
  textoVoltar: {
    color: "#c3c3c3",
    fontWeight: "bold",
  },
});
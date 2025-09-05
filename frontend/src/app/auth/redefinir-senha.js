import { useSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";

export default function RedefinirSenha() {
  const { token } = useSearchParams();
  const router = useRouter();

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const resetarSenha = async () => {
    if (!senha || senha.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    if (senha !== confirmarSenha) {
      alert("As senhas não conferem");
      return;
    }

    setCarregando(true);

    try {
      await axios.post("http://192.168.58.167:3000/resetar-senha", {
        token,
        novaSenha: senha,
      });
      alert("Senha redefinida com sucesso!");
      router.push("/auth/login"); // volta para login
    } catch (error) {
      alert("Erro ao redefinir senha. Tente novamente.");
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Redefinir Senha</Text>
      <TextInput
        placeholder="Nova senha"
        secureTextEntry
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
      />
      <TextInput
        placeholder="Confirmar nova senha"
        secureTextEntry
        style={styles.input}
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />
      <Button
        title={carregando ? "Enviando..." : "Redefinir Senha"}
        onPress={resetarSenha}
        disabled={carregando}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  titulo: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderBottomWidth: 1,
    marginBottom: 15,
    fontSize: 16,
    paddingVertical: 8,
  },
});

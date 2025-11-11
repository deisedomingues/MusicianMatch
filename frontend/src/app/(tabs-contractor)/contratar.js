import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import api from "../api/api";


export default function ContratarPage() {
  const { cpf } = useLocalSearchParams(); // pega o CPF do músico da URL

  const [dataEvento, setDataEvento] = React.useState("");
  const [horario, setHorario] = React.useState("");
  const [localizacao, setLocalizacao] = React.useState("");
  const [observacoes, setObservacoes] = React.useState("");

  async function handleContratar() {
    try {
      const cpf_contratante = "11111111111"; // depois trocaremos pelo CPF do usuário logado

      await api.post("/contratacoes", {
        cpf_contratante,
        cpf_musico: cpf,
        data_evento: dataEvento,
        horario,
        localizacao,
        observacoes,
      });

      Alert.alert("Sucesso", "Solicitação de contratação enviada!");
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível enviar a contratação.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Contratar Músico</Text>
      <Text style={styles.subtitulo}>CPF do músico: {cpf}</Text>

      <TextInput
        placeholder="Data do evento (AAAA-MM-DD)"
        style={styles.input}
        value={dataEvento}
        onChangeText={setDataEvento}
      />

      <TextInput
        placeholder="Horário"
        style={styles.input}
        value={horario}
        onChangeText={setHorario}
      />

      <TextInput
        placeholder="Localização"
        style={styles.input}
        value={localizacao}
        onChangeText={setLocalizacao}
      />

      <TextInput
        placeholder="Observações"
        style={[styles.input, { height: 80 }]}
        value={observacoes}
        onChangeText={setObservacoes}
        multiline
      />

      <TouchableOpacity style={styles.botao} onPress={handleContratar}>
        <Text style={styles.textoBotao}>Confirmar Contratação</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    padding: 20,
  },
  titulo: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitulo: {
    color: "#ccc",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  botao: {
    backgroundColor: "#8F16A7",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

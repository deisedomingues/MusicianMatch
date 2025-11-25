import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import api from "../api/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaskedTextInput } from "react-native-mask-text";

export default function ContratarPage() {
  const { cpfMusico, nomeMusico, instrumentosMusico } = useLocalSearchParams();

  const [dataEvento, setDataEvento] = useState("");
  const [horario, setHorario] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  function onDateSelected(event, selectedDate) {
    setShowDatePicker(false);
    if (selectedDate) {
      const ano = selectedDate.getFullYear();
      const mes = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const dia = String(selectedDate.getDate()).padStart(2, "0");
      setDataEvento(`${ano}-${mes}-${dia}`);
    }
  }

  async function handleContratar() {
    if (!dataEvento || !horario || !localizacao) {
      return Alert.alert("Campos obrigatórios", "Preencha todos os campos.");
    }

    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (!userDataString) {
        Alert.alert("Erro", "Usuário não encontrado. Faça login novamente.");
        return;
      }
      const userData = JSON.parse(userDataString);

      const payload = {
        cpf_contratante: userData.cpf,
        cpf_musico: cpfMusico,
        nome_musico: nomeMusico,
        instrumentos: instrumentosMusico,
        data_evento: dataEvento,
        horario,
        localizacao,
        observacoes,
      };

      console.log("Payload para contratar:", payload);

      const response = await api.post("/contratacoes", payload);

      console.log("Resposta do backend:", response.data);

      Alert.alert("Sucesso", "Solicitação enviada com sucesso!");
      router.back(); // ou router.replace para não empilhar telas

    } catch (error) {
      console.error("Erro ao fazer contratação:", error.response ?? error);
      Alert.alert("Erro", "Não foi possível realizar a contratação.");
    }
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={20} color="#fff" />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Contratar Músico</Text>

      <Text style={styles.label}>Data do Evento</Text>
      {Platform.OS !== "web" ? (
        <>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: dataEvento ? "#fff" : "#aaa" }}>
              {dataEvento || "Selecione a data"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="spinner"
              themeVariant="dark"
              onChange={onDateSelected}
            />
          )}
        </>
      ) : (
        <View style={styles.webInputWrapper}>
          <input
            type="date"
            style={styles.webDateInput}
            value={dataEvento}
            onChange={(e) => setDataEvento(e.target.value)}
          />
        </View>
      )}

      <Text style={styles.label}>Horário</Text>
      <MaskedTextInput
        mask="99:99"
        placeholder="HH:MM"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        style={styles.input}
        value={horario}
        onChangeText={setHorario}
      />

      <Text style={styles.label}>Localização</Text>
      <TextInput
        placeholder="Endereço completo"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={localizacao}
        onChangeText={setLocalizacao}
      />

      <Text style={styles.label}>Observações</Text>
      <TextInput
        placeholder="Detalhes adicionais"
        placeholderTextColor="#aaa"
        style={[styles.input, { height: 90 }]}
        value={observacoes}
        onChangeText={setObservacoes}
        multiline
      />

      <TouchableOpacity style={styles.botao} onPress={handleContratar}>
        <Text style={styles.textoBotao}>Confirmar Contratação</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d", padding: 20 },
  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 10, width: 100 },
  backText: { color: "#fff", marginLeft: 10, fontSize: 16 },
  titulo: { fontSize: 26, color: "#fff", fontWeight: "bold", marginBottom: 20 },
  label: { color: "#fff", marginBottom: 6, marginTop: 6, fontSize: 15 },
  input: {
    backgroundColor: "#1c1c1c",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 12,
  },
  botao: { backgroundColor: "#A020F0", padding: 14, borderRadius: 12, alignItems: "center", marginTop: 10 },
  textoBotao: { color: "#fff", fontSize: 17, fontWeight: "bold" },
  webInputWrapper: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#1c1c1c",
    height: 48,
    justifyContent: "center",
    marginBottom: 12,
  },
  webDateInput: { width: "100%", height: "100%", backgroundColor: "transparent", color: "#fff", paddingHorizontal: 12, border: "none", outline: "none" },
});

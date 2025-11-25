import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../api/api";

export default function AvaliarMusico() {
  const router = useRouter();
  const { cpf_contratante, cpf_musico, id_contratacao } = useLocalSearchParams();

  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);

  const enviarAvaliacao = async () => {
    if (rating === 0)
      return Alert.alert("Aviso", "Por favor, selecione uma nota (estrelas).");

    try {
      setLoading(true);

      const body = {
        cpf_contratante,
        cpf_musico,
        nota: rating,
        comentario,
        id_contratacao, // ← ESSENCIAL para marcar como avaliada
      };

      const { data } = await api.post("/avaliacoes", body);

      Alert.alert("Sucesso", "Avaliação enviada!");
      router.back();
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
      Alert.alert("Erro", "Não foi possível enviar a avaliação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={20} color="#fff" />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Avaliar Músico</Text>

      <Text style={styles.label}>Nota</Text>

      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity key={n} onPress={() => setRating(n)}>
            <Ionicons
              name={n <= rating ? "star" : "star-outline"}
              size={40}
              color="#FFD700"
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Comentário (opcional)</Text>

      <TextInput
        style={styles.input}
        placeholder="Escreva aqui..."
        placeholderTextColor="#777"
        multiline
        value={comentario}
        onChangeText={setComentario}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.5 }]}
        disabled={loading}
        onPress={enviarAvaliacao}
      >
        <Text style={styles.buttonText}>
          {loading ? "Enviando..." : "Enviar Avaliação"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A181D", padding: 18 },
  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backText: { color: "#fff", fontSize: 16, marginLeft: 6 },
  title: { fontSize: 24, color: "#fff", fontWeight: "bold", marginBottom: 20 },
  label: { color: "#A0A0A0", fontSize: 14, marginTop: 12 },
  starsRow: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 20,
    justifyContent: "flex-start",
  },
  input: {
    backgroundColor: "#1E1E2A",
    color: "#fff",
    height: 120,
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#6C63FF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

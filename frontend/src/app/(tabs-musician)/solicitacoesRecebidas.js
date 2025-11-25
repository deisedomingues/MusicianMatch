import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import formatDate from "../utils/dateformat";

export default function SolicitacoesRecebidas() {
  const [user, setUser] = useState(null);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const carregarSolicitacoes = async () => {
    setLoading(true);
    const st = await AsyncStorage.getItem("userData");
    if (!st) return router.replace("/auth/login");

    const u = JSON.parse(st);
    setUser(u);

    try {
      const { data } = await api.get("/contratacoes");
      const recebidas = data.filter((c) => c.cpf_musico === u.cpf);
      setSolicitacoes(recebidas);
    } catch (err) {
      console.error("Erro ao carregar solicitações:", err);
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (id, novoStatus) => {
    try {
      await api.put(`/contratacoes/${id}`, { status: novoStatus });
      Alert.alert("Sucesso", `Solicitação ${novoStatus} com sucesso!`);
      carregarSolicitacoes();
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      Alert.alert("Erro", "Não foi possível atualizar a solicitação.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarSolicitacoes();
    }, [])
  );

  if (loading)
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.push("/(tabs-musician)/home")}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={22} color="#fff" />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Solicitações Recebidas</Text>
      <Text style={{ color: "#ccc", marginBottom: 12 }}>
        Aqui fica as solicitações dos seus serviços, como Musicista.
      </Text>

      {solicitacoes.length === 0 ? (
        <Text style={styles.empty}>
          Nenhuma solicitação recebida até o momento.
        </Text>
      ) : (
        <FlatList
          data={solicitacoes}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.label}>Contratante - nome</Text>
              <Text style={styles.value}>{item.nome_contratante}</Text>

              <Text style={styles.label}>Contratante - cpf</Text>
              <Text style={styles.value}>{item.cpf_contratante}</Text>

              <Text style={styles.label}>Data do Evento</Text>
              <Text style={styles.value}>
                {formatDate(item.data_evento) || "—"}
              </Text>

              <Text style={styles.label}>Horário</Text>
              <Text style={styles.value}>{item.horario || "—"}</Text>

              <Text style={styles.label}>Localização</Text>
              <Text style={styles.value}>{item.localizacao || "—"}</Text>

              <Text style={styles.label}>Observações</Text>
              <Text style={styles.value}>{item.observacoes || "—"}</Text>

              <Text style={styles.label}>Status</Text>
              <Text
                style={[
                  styles.value,
                  {
                    color:
                      item.status === "confirmado"
                        ? "#0B8A1F"
                        : item.status === "cancelado"
                        ? "#B81D1D"
                        : "#C9A000",
                  },
                ]}
              >
                {item.status}
              </Text>

              {/* Botões Aceitar/Recusar só aparecem se status for pendente */}
              {item.status === "pendente" && (
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#0B8A1F" }]}
                    onPress={() => atualizarStatus(item.id, "confirmado")}
                  >
                    <Text style={styles.buttonText}>Aceitar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#B81D1D" }]}
                    onPress={() => atualizarStatus(item.id, "cancelado")}
                  >
                    <Text style={styles.buttonText}>Recusar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A181D", padding: 16 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  backText: { color: "#fff", fontSize: 16, marginLeft: 6 },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  empty: { color: "#aaa", marginTop: 20, textAlign: "center" },
  card: {
    backgroundColor: "#1E1E2A",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
  },
  label: { color: "#A0A0A0", fontSize: 12, marginTop: 6 },
  value: { color: "#fff", fontSize: 16 },
  actionsRow: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

// src/app/(tabs-musician)/contratacaoDetalhes.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { Ionicons } from "@expo/vector-icons";

export default function ContratacaoDetalhes() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const contratacaoId = params.id || params?.contratacaoId;

  const [loading, setLoading] = useState(true);
  const [contratacao, setContratacao] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        if (!contratacaoId) {
          Alert.alert("Erro", "ID da contratação não informado.");
          router.back();
          return;
        }

        const { data } = await api.get(`/contratacoes/${contratacaoId}`);
        setContratacao(data);
      } catch (err) {
        console.error(err);
        Alert.alert("Erro", "Não foi possível carregar a contratação.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleStatus = async (novoStatus) => {
    try {
      setLoading(true);

      await api.put(`/contratacoes/${contratacaoId}`, {
        status: novoStatus,
      });

      Alert.alert("Sucesso", `Status atualizado para '${novoStatus}'.`);

      const { data } = await api.get(`/contratacoes/${contratacaoId}`);
      setContratacao(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível atualizar o status.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push({
      pathname: "/(tabs-musician)/minhasContratacoes",
      params: { updated: true },
    });
  };

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Carregando...</Text>
      </View>
    );

  if (!contratacao)
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={18} color="#fff" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.emptyText}>Contratação não encontrada.</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Ionicons name="chevron-back" size={18} color="#fff" />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Detalhes da Contratação</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Contratante</Text>
        <Text style={styles.value}>
          {contratacao.nome_contratante || contratacao.cpf_contratante}
        </Text>

        <Text style={styles.label}>Data</Text>
        <Text style={styles.value}>{contratacao.data_evento || "—"}</Text>

        <Text style={styles.label}>Horário</Text>
        <Text style={styles.value}>{contratacao.horario || "—"}</Text>

        <Text style={styles.label}>Localização</Text>
        <Text style={styles.value}>{contratacao.localizacao || "—"}</Text>

        <Text style={styles.label}>Observações</Text>
        <Text style={styles.value}>{contratacao.observacoes || "—"}</Text>

        <Text style={styles.label}>Status</Text>
        <View
          style={[styles.statusBox, getStatusColor(contratacao.status)]}
        >
          <Text style={styles.statusText}>{contratacao.status}</Text>
        </View>

        {contratacao.status === "pendente" && (
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#0B8A1F" }]}
              onPress={() => handleStatus("confirmado")}
            >
              <Text style={styles.actionText}>Aceitar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#B81D1D" }]}
              onPress={() => handleStatus("cancelado")}
            >
              <Text style={styles.actionText}>Recusar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function getStatusColor(status) {
  switch (status) {
    case "pendente":
      return { backgroundColor: "#C9A000" };
    case "confirmado":
      return { backgroundColor: "#0B8A1F" };
    case "cancelado":
      return { backgroundColor: "#B81D1D" };
    default:
      return { backgroundColor: "#444" };
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A181D", padding: 16 },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#1A181D",
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: 90,
  },
  backText: {
    color: "#fff",
    marginLeft: 12,
    fontSize: 16,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1E1E2A",
    padding: 16,
    borderRadius: 14,
  },
  label: { color: "#A0A0A0", fontSize: 12, marginTop: 10 },
  value: { color: "#fff", fontSize: 16 },
  statusBox: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 6,
    width: 150,
    alignItems: "center",
  },
  statusText: { color: "#fff", fontWeight: "bold" },
  emptyText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
  },
  buttonsRow: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 4,
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

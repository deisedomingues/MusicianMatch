import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { useRouter, useFocusEffect } from "expo-router";
import formatDate from "../utils/dateformat";

export default function MinhasContratacoesMusico() {
  const [user, setUser] = useState(null);
  const [contratacoes, setContratacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const carregarContratacoes = async () => {
    setLoading(true);
    const st = await AsyncStorage.getItem("userData");
    if (!st) return router.replace("/auth/login");

    const u = JSON.parse(st);
    setUser(u);

    try {
      const { data } = await api.get(`/contratacoes`);
      // Aqui o músico é o contratado
      const minhas = data.filter((c) => c.cpf_musico === u.cpf);
      setContratacoes(minhas);
    } catch (err) {
      console.error("Erro ao carregar contratações:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarContratacoes();
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
      <Text style={styles.title}>Minhas Contratações</Text>
      <Text style={{ color: "#ccc", marginBottom: 12 }}>
        Aqui fica os contratos solicitados por você, como o Contratante.
      </Text>

      {contratacoes.length === 0 ? (
        <Text style={styles.empty}>Você ainda não recebeu contratações.</Text>
      ) : (
        <FlatList
          data={contratacoes}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.label}>Prestador(a)</Text>
              <Text style={styles.value}>
                {item.nome_contratante || item.cpf_contratante}
              </Text>

              <Text style={styles.label}>Data</Text>
              <Text style={styles.value}>
                {formatDate(item.data_evento) || "—"}
              </Text>

              <Text style={styles.label}>Local</Text>
              <Text style={styles.value}>{item.localizacao || "—"}</Text>

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

              {/* BOTÃO AVALIAR — aparece só quando está confirmado */}
              {item.status === "confirmado" && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs-musician)/avaliarMusico",
                      params: {
                        cpf_contratante: item.cpf_contratante,
                        cpf_musico: item.cpf_musico,
                      },
                    })
                  }
                >
                  <Text style={styles.buttonText}>Avaliar</Text>
                </TouchableOpacity>
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

  button: {
    backgroundColor: "#6C63FF",
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

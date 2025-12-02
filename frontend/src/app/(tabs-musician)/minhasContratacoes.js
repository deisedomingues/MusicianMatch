import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { useRouter, useFocusEffect } from "expo-router";
import formatDate from "../utils/dateformat";
import { Ionicons } from "@expo/vector-icons"; // Importado para o botão Voltar

// Função para definir a cor do texto do status (reutilizada do tabs-contractor)
const getStatusTextColor = (status) => {
  switch (status) {
    case "confirmado":
      return "#0B8A1F";
    case "cancelado":
      return "#B81D1D";
    case "pendente":
    default:
      return "#C9A000";
  }
};

export default function MinhasContratacoesMusicoContratante() {
  const [user, setUser] = useState(null);
  const [contratacoes, setContratacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const carregarContratacoes = async () => {
    setLoading(true);
    const st = await AsyncStorage.getItem("userData");
    if (!st) {
      setLoading(false);
      return router.replace("/auth/login");
    }

    const u = JSON.parse(st);
    setUser(u);

    try {
      // 1. Busca TODAS as contratações (Rota adaptada do tabs-contractor)
      const { data } = await api.get(`/contratacoes`);
      // 2. Filtra APENAS as contratações onde o usuário logado é o CONTRATANTE
      const minhas = Array.isArray(data)
        ? data.filter((c) => c.cpf_contratante === u.cpf)
        : [];
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

  const abrirWhatsApp = (numeroComDDI, nome) => {
    if (!numeroComDDI) return;
    const link = `https://wa.me/${numeroComDDI}?text=Olá%20${encodeURIComponent(
      nome || "músico"
    )},%20gostaria%20de%20falar%20sobre%20a%20contratação`;
    Linking.openURL(link);
  };
  
  const handleBack = () => router.replace("/(tabs-musician)/home");


  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
        {/* BOTÃO VOLTAR (Mantido da versão anterior em tabs-musician) */}
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={18} color="#fff" />
            <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

      <Text style={styles.title}>Minhas Contratações (Como Contratante)</Text>

      {contratacoes.length === 0 ? (
        <Text style={styles.empty}>Você ainda não fez contratações.</Text>
      ) : (
        <FlatList
          data={contratacoes}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.label}>Músico Contratado</Text>
              <Text style={styles.value}>
                {item.nome_musico || item.cpf_musico || "—"}
              </Text>

              <Text style={styles.label}>Data do Evento</Text>
              <Text style={styles.value}>
                {item.data_evento ? formatDate(item.data_evento) : "—"}
              </Text>

              <Text style={styles.label}>Local</Text>
              <Text style={styles.value}>{item.localizacao || "—"}</Text>

              <Text style={styles.label}>Status</Text>
              <Text
                style={[
                  styles.value,
                  {
                    color: getStatusTextColor(item.status),
                  },
                ]}
              >
                {item.status || "—"}
              </Text>

              {/* Telefone e Email do Músico */}
              <Text style={styles.label}>Telefone do Músico</Text>
              <Text style={styles.value}>{item.telefone_musico || "—"}</Text>

              <Text style={styles.label}>Email do Músico</Text>
              <Text style={styles.value}>{item.email_musico || "—"}</Text>

              {/* Botão WhatsApp aparece somente quando status for confirmado */}
              {item.status === "confirmado" && item.telefone_musico_whatsapp ? (
                <TouchableOpacity
                  style={styles.whatsappButton}
                  onPress={() =>
                    abrirWhatsApp(
                      item.telefone_musico_whatsapp,
                      item.nome_musico
                    )
                  }
                >
                  <Text style={styles.whatsappText}>
                    Entrar em contato pelo WhatsApp
                  </Text>
                </TouchableOpacity>
              ) : null}

              {/* Botão Avaliar apenas quando confirmado */}
              {item.status === "confirmado" ? (
                item.avaliado ? (
                  <View style={styles.avaliadoBox}>
                    <Text style={styles.avaliadoText}>
                      Você já avaliou esta contratação
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      router.push({
                        
                        pathname: "/(tabs-musician)/avaliarMusico",
                        params: {
                          cpf_contratante: item.cpf_contratante, 
                          cpf_musico: item.cpf_musico,
                          id_contratacao: item.id,
                        },
                      })
                    }
                  >
                    <Text style={styles.buttonText}>Avaliar</Text>
                  </TouchableOpacity>
                )
              ) : null}
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
  title: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 25 },
  empty: { color: "#aaa", marginTop: 40, textAlign: "center" },

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
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  whatsappButton: {
    backgroundColor: "#25D366", // verde WhatsApp
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  whatsappText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  avaliadoBox: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#2E2C30",
  },
  avaliadoText: { color: "#aaa", fontSize: 14 },
  
  
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
});
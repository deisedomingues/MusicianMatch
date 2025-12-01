import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import formatDate from "../utils/dateformat";

export default function ContratacoesMusico() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contratacoes, setContratacoes] = useState([]);

  // carrega dados do músico logado
  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem("userData");
      if (!stored) {
        router.replace("/auth/login");
        return;
      }
      const parsedUser = JSON.parse(stored);
      setUser(parsedUser);
      return parsedUser;
    } catch (err) {
      console.log("Erro ao carregar usuário", err);
    }
  };

  // busca contratações desse músico
  const loadContratacoes = async (cpf) => {
    try {
      const { data } = await api.get(`/contratacoes/musico/${cpf}`);
      setContratacoes(data);
    } catch (err) {
      console.log("Erro ao buscar contratações:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      const u = await loadUser();
      if (u?.cpf) await loadContratacoes(u.cpf);
      setLoading(false);
    };
    init();
  }, []);

  // botão voltar → home do músico
  const handleBack = () => router.replace("/(tabs-musician)/home");

  const abrirWhatsApp = (numeroComDDI, nome) => {
    if (!numeroComDDI) return;
    const link = `https://wa.me/${numeroComDDI}?text=Olá%20${encodeURIComponent(
      nome || "contratante"
    )},%20gostaria%20de%20falar%20sobre%20a%20contratação`;
    Linking.openURL(link);
  };

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Carregando...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      {/* BOTÃO VOLTAR */}
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Ionicons name="chevron-back" size={18} color="#fff" />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Minhas Contratações</Text>

      {contratacoes.length === 0 ? (
        <Text style={styles.emptyText}>Você ainda não foi contratado.</Text>
      ) : (
        <FlatList
          data={contratacoes}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Nome do contratante */}
              <Text style={styles.label}>Contratante:</Text>
              <Text style={styles.value}>
                {item.nome_contratante || item.cpf_contratante || "—"}
              </Text>

              {/* Data do evento */}
              <Text style={styles.label}>Data do Evento:</Text>
              <Text style={styles.value}>
                {item.data_evento ? formatDate(item.data_evento) : "—"}
              </Text>

              {/* Local */}
              <Text style={styles.label}>Local:</Text>
              <Text style={styles.value}>{item.localizacao || "—"}</Text>

              {/* Observações */}
              <Text style={styles.label}>Observações:</Text>
              <Text style={styles.value}>{item.observacoes || "—"}</Text>

              {/* Status */}
              <Text style={styles.label}>Status:</Text>
              <View style={[styles.statusBox, getStatusColor(item.status)]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>

              {/* Telefone e Email do contratante (vindos do backend) */}
              <Text style={styles.label}>Telefone</Text>
              <Text style={styles.value}>{item.telefone_contratante || "—"}</Text>

              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{item.email_contratante || "—"}</Text>

              {/* Botão WhatsApp aparece somente quando status for confirmado */}
              {item.status === "confirmado" && item.telefone_contratante_whatsapp ? (
                <TouchableOpacity
                  style={styles.whatsappButton}
                  onPress={() =>
                    abrirWhatsApp(
                      item.telefone_contratante_whatsapp,
                      item.nome_contratante
                    )
                  }
                >
                  <Text style={styles.whatsappText}>
                    Entrar em contato pelo WhatsApp
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        />
      )}
    </View>
  );
}

// define cores do status
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
  container: {
    flex: 1,
    backgroundColor: "#1A181D",
    padding: 16,
  },

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
    marginBottom: 25,
  },

  emptyText: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },

  card: {
    backgroundColor: "#1E1E2A",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },

  label: {
    color: "#A0A0A0",
    fontSize: 12,
    marginTop: 6,
  },

  value: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 6,
  },

  statusBox: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 4,
    width: 120,
    alignItems: "center",
  },

  statusText: {
    color: "#fff",
    fontWeight: "bold",
    textTransform: "capitalize",
  },

  whatsappButton: {
    backgroundColor: "#25D366", // verde WhatsApp
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  whatsappText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

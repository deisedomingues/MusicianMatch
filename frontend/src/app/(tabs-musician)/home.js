import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "../api/api";
import { Ionicons } from "@expo/vector-icons";

const meses = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

export default function MusicianHome() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [musicoData, setMusicoData] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loadingAvaliacoes, setLoadingAvaliacoes] = useState(true);
  const router = useRouter();

  const data = new Date();
  const dia = data.getDate();
  const mes = meses[data.getMonth()];

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUser(userData);

        // Buscar dados do músico (nota média, etc.)
        const response = await api.get(`/musicos/${userData.cpf}`);
        if (response.data) {
          setMusicoData(response.data);
        }

        // Buscar avaliações recebidas
        const resAvaliacoes = await api.get(
          `/avaliacoes/musico/${userData.cpf}`
        );
        if (resAvaliacoes.data) {
          setAvaliacoes(resAvaliacoes.data);
        }
      } else {
        router.replace("/auth/login");
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      router.replace("/auth/login");
    } finally {
      setLoading(false);
      setLoadingAvaliacoes(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleEdit = () => router.push("/(tabs-musician)/editProfile");

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#fff" size="large" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://picsum.photos/200" }}
          style={styles.profileIcon}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.date}>
            <Text style={{ color: "#fff" }}>Hoje,</Text> {dia} {mes}
          </Text>
        </View>
        <TouchableOpacity style={styles.settingsButton} onPress={handleEdit}>
          <Ionicons name="settings" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Saudação */}
      <Text style={styles.greeting}>
        Olá <Text style={styles.name}>{user.nome} 🎻</Text>
      </Text>

      {/* Avaliação média */}
      {musicoData && (
        <View style={styles.ratingBox}>
          <Ionicons name="star" size={22} color="#FFD700" />
          <Text style={styles.ratingText}>
            Sua nota atual é {musicoData.nota_media}
          </Text>
        </View>
      )}

      {/* Últimas avaliações */}
      <Text style={styles.sectionTitle}>Últimas avaliações recebidas</Text>
      {loadingAvaliacoes ? (
        <ActivityIndicator color="#fff" />
      ) : avaliacoes.length === 0 ? (
        <Text style={{ color: "#aaa", marginBottom: 20 }}>
          Nenhuma avaliação ainda.
        </Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 25 }}
        >
          {avaliacoes.map((av, index) => (
            <View key={index} style={styles.avaliacaoCard}>
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Ionicons
                    key={n}
                    name={n <= av.nota ? "star" : "star-outline"}
                    size={20}
                    color="#FFD700"
                  />
                ))}
              </View>
              <Text style={styles.avaliacaoComentario}>
                {av.comentario || "Sem comentário"}
              </Text>
              <Text style={styles.avaliacaoAutor}>
                Por: {av.contratante_nome}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Botão para buscar musicistas disponíveis */}
      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => router.push("/(tabs-musician)/listMusicians")}
      >
        <Text style={styles.mainButtonText}>Listar musicistas disponíveis</Text>
        <Ionicons name="musical-notes" size={20} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A181D", padding: 16 },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    justifyContent: "center",
    alignItems: "center",
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  profileIcon: { width: 45, height: 45, borderRadius: 25, marginRight: 10 },
  date: { fontSize: 24, color: "#aaa", fontWeight: "600" },
  settingsButton: {
    backgroundColor: "#2E2C30",
    width: 32,
    height: 32,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  greeting: { color: "#fff", fontSize: 26, marginBottom: 20 },
  name: { color: "#fff", fontWeight: "bold" },
  ratingBox: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  ratingText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  avaliacaoCard: {
    backgroundColor: "#2b0e47",
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    width: 250,
  },
  ratingRow: { flexDirection: "row", marginBottom: 8 },
  avaliacaoComentario: { color: "#fff", fontSize: 14, marginBottom: 6 },
  avaliacaoAutor: { color: "#aaa", fontSize: 12 },
  mainButton: {
    backgroundColor: "#871F78",
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginVertical: 10,
  },
  mainButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
});
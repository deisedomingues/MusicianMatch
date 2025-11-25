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
import pexelsApi from "../api/pexels";
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

export default function Home() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [musicos, setMusicos] = useState([]);
  const [loadingMusicos, setLoadingMusicos] = useState(true);
  const [fotosPexels, setFotosPexels] = useState([]); // armazenar as fotos do Pexels
  const router = useRouter();
  const data = new Date();
  const dia = data.getDate();
  const mes = meses[data.getMonth()];

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (userDataString) {
        setUser(JSON.parse(userDataString));
      } else {
        router.replace("/auth/login");
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      router.replace("/auth/login");
    } finally {
      setLoadingUser(false);
    }
  };

  const loadMusicos = async () => {
    try {
      setLoadingMusicos(true);
      const { data } = await api.get("/musicos");
      const melhores = [...data]
        .sort((a, b) => (b.nota_media || 0) - (a.nota_media || 0))
        .slice(0, 3);
      setMusicos(melhores);
    } catch (error) {
      console.error("Erro ao carregar músicos:", error);
    } finally {
      setLoadingMusicos(false);
    }
  };

  //  Buscar imagens de shows / festivais no Pexels
  const loadFotosPexels = async () => {
    try {
      const { data } = await pexelsApi.get("/search", {
        params: { query: "concert", per_page: 10 },
      });
      setFotosPexels(data.photos.map((p) => p.src.medium));
    } catch (error) {
      console.error("Erro ao carregar fotos do Pexels:", error);
    }
  };

  useEffect(() => {
    loadUserData();
    loadMusicos();
    loadFotosPexels();
  }, []);

  const handleEdit = () => router.push("/(tabs-contractor)/editProfile");

  if (loadingUser || !user) {
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
          source={{ uri: fotosPexels[0] || "https://via.placeholder.com/200" }}
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
        Olá <Text style={styles.name}>{user.nome} 👋</Text>
      </Text>

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image
          source={require("../../../assets/banner.png")}
          style={styles.banner}
        />
      </View>

      {/* Recomendações */}
      <Text style={styles.sectionTitle}>Artistas Recomendados</Text>
      {loadingMusicos ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {musicos.length === 0 ? (
            <Text style={{ color: "#aaa" }}>Nenhum músico encontrado.</Text>
          ) : (
            musicos.map((musico, index) => (
              <TouchableOpacity
                key={musico.cpf}
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs-contractor)/[cpf]",
                    params: { cpf: musico.cpf },
                  })
                }
              >
                <Image
                  source={{
                    uri:
                      musico.foto ||
                      fotosPexels[index % fotosPexels.length] ||
                      "https://via.placeholder.com/300",
                  }}
                  style={styles.cardImage}
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardName}>{musico.nome}</Text>
                  <Text style={styles.cardText}>
                    {musico.instrumentos || ""}
                  </Text>
                  <Text style={styles.cardText}>
                    {musico.localizacao || ""}
                  </Text>
                  <Text style={styles.cardBio}>{musico.bio || ""}</Text>
                  <View style={styles.rating}>
                    <Ionicons name="star" size={20} color="#fff" />
                    <Text style={styles.ratingText}>{musico.nota_media}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      {/* Botão principal */}
      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => router.push("/(tabs-contractor)/listMusicians")}
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
  bannerContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: 25,
    height: 170,
  },
  banner: {
    height: "100%",
    resizeMode: "cover",
    width: "100%",
    borderRadius: 12,
  },
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
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    width: 280,
    marginRight: 16,
  },
  cardImage: { width: "100%", height: 160 },
  cardContent: { padding: 12 },
  cardName: { fontSize: 18, fontWeight: "bold", color: "#000" },
  cardText: { fontSize: 14, color: "#7D7D7D", marginTop: 4 },
  cardBio: { fontSize: 14, color: "#333", marginTop: 6 },
  rating: {
    backgroundColor: "#871F78",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 8,
    right: 8,
  },
  ratingText: { color: "#fff", fontWeight: "bold", marginLeft: 4 },
  mainButton: {
    backgroundColor: "#871F78",
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginVertical: 25,
  },
  mainButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
});

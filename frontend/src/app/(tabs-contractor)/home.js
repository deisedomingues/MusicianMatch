import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
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

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
      } else {
        router.replace("/auth/login");
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      router.replace("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleEdit = () => router.push("/(tabs-contractor)/editProfile");

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "#fff" }}>Carregando...</Text>
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
      <View>
        <Text style={styles.greeting}>
          Olá <Text style={styles.name}>{user.nome} 👋</Text>
        </Text>
      </View>
      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image source={require("../assets/banner.png")} style={styles.banner} />
      </View>

      {/* Recomendações */}
      <Text style={styles.sectionTitle}>Artistas Recomendados</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.card}>
          <Image
            source={require("../assets/musicianImage.png")}
            style={styles.cardImage}
          />
          <View style={styles.cardContent}>
            <Text style={styles.cardName}>Lucas Sabatino</Text>
            <Text style={styles.cardText}>Localização: São Paulo/SP</Text>
            <Text style={styles.cardText}>Instrumento: Guitarra</Text>
            <Text style={styles.cardBio}>
              Bio: Lorem ipsum dolor sit amet...
            </Text>
            <View style={styles.rating}>
              <Ionicons name="star" size={20} color="#fff" />
              <Text style={styles.ratingText}>4.8</Text>
            </View>
          </View>
        </View>
      </ScrollView>

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
  container: {
    flex: 1,
    backgroundColor: "#1A181D",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  bannerContainer: {
    alignItems: "center",
    width: "100%",
    maxWidth: 1000,
    margin: "auto",
    marginBottom: 25,
    height: 170,
  },
  banner: {
    height: "100%",
    resizeMode: "cover",
    backgroundPosition: "top",
    width: "100%",
    borderRadius: 12,
    marginBottom: 20,
  },
  profileIcon: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 10,
  },
  date: {
    fontSize: 24,
    color: "#aaa",
    fontWeight: "600",
  },
  settingsButton: {
    // marginLeft: "auto",
    backgroundColor: "#2E2C30",
    width: 32,
    height: 32,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  greeting: {
    color: "#fff",
    fontSize: 26,
    marginBottom: 20,
  },
  name: {
    color: "#fff",
    fontWeight: "bold",
  },
  // --- Seção de Artistas ---
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  viewAll: {
    color: "#B0B0B0",
    fontSize: 16,
  },

  // --- Card de Artista ---
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    width: 280,
    marginRight: 16,
  },
  cardImage: {
    width: "100%",
    height: 160,
  },
  cardContent: {
    padding: 12,
  },
  cardName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  cardLocation: {
    fontSize: 14,
    color: "#7D7D7D",
    marginTop: 4,
  },
  cardInstrument: {
    fontSize: 14,
    color: "#7D7D7D",
    marginTop: 2,
  },
  cardBio: {
    fontSize: 14,
    color: "#333",
    marginTop: 6,
  },
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
  ratingText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 4,
  },

  // --- Botão principal ---
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

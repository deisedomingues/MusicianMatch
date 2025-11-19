// src/app/tabs-musician/home.js

import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
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
      console.error("Erro ao carregar dados:", error);
      router.replace("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleEdit = () => router.push("/(tabs-musician)/editProfile");

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
      <Text style={styles.greeting}>
        Olá <Text style={styles.name}>{user.nome} 🎻</Text>
      </Text>


      {/* Botão para buscar musicistas disponíveis */}
      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => router.push("/(tabs-musician)/listMusicians")}
      >
        <Text style={styles.mainButtonText}>
          Listar musicistas disponíveis
        </Text>
        <Ionicons name="musical-notes" size={20} color="#fff" />
      </TouchableOpacity>

      {/* BOTÃO EXTRA — Minhas contratações */}
      <TouchableOpacity
        style={[styles.mainButton, { backgroundColor: "#2E2C30" }]}
        onPress={() => router.push("/(tabs-musician)/contratacoes")}
      >
        <Text style={styles.mainButtonText}>Minhas contratações</Text>
        <Ionicons name="briefcase" size={20} color="#fff" />
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
    marginBottom: 25,
    height: 170,
  },
  banner: {
    height: "100%",
    resizeMode: "cover",
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
  cardText: {
    fontSize: 14,
    color: "#7D7D7D",
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

  // Botões
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

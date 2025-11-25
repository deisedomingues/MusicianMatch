import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "../api/api";
import { Ionicons } from "@expo/vector-icons";

export default function ListMusicians() {
  const [usersList, setUsersList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  console.log(filteredUsers);

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
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
    api
      .get("/musicos")
      .then((response) => {
        setUsersList(response.data);
        setFilteredUsers(response.data);
      })
      .catch((error) => console.error("Erro ao obter dados:", error));
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    if (text.trim() === "") {
      setFilteredUsers(usersList);
    } else {
      const lower = text.toLowerCase();
      const filtered = usersList.filter(
        (u) =>
          u.nome.toLowerCase().includes(lower) ||
          u.email.toLowerCase().includes(lower) ||
          (u.instrumentos || "").toLowerCase().includes(lower)
      );
      setFilteredUsers(filtered);
    }
  };

  const handleEdit = () => router.push("/(tabs-contractor)/editProfile");

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
        <Image source={require("../assets/logo.png")} style={styles.appImage} />
        <TouchableOpacity style={styles.settingsButton} onPress={handleEdit}>
          <Ionicons name="settings" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          marginBottom: 20,
          flexDirection: "row",
          alignItems: "center",
          width: 80,
        }}
      >
        <Ionicons name="chevron-back" size={18} color="#fff" />
        <Text style={{ color: "#fff", marginLeft: 24 }}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Artistas Disponíveis</Text>

      {/* Busca */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#ccc" />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquise por instrumento ou artista"
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      {/* Lista de músicos */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.cpf}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/(tabs-contractor)/[cpf]",
                params: { cpf: item.cpf },
              })
            }
          >
            <View style={styles.leftSection}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={32} color="#fff" />
              </View>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.label}>Nome</Text>
                  <Text style={styles.name}>{item.nome}</Text>
                </View>
                <View style={styles.columnRight}>
                  <Text style={styles.label}>Pontuação</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.rating}>{item.nota_media || "—"}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.label}>Instrumento</Text>
                  <Text style={styles.value}>{item.instrumentos}</Text>
                </View>
                <View style={styles.columnRight}>
                  <Text style={styles.label}>Localização</Text>
                  <Text style={styles.value}>{item.localizacao}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{ color: "#fff", fontSize: 16 }}>
              Não há dados disponíveis
            </Text>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 16 },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  appImage: { width: 118, height: 42 },
  settingsButton: {
    backgroundColor: "#2A2A2A",
    width: 36,
    height: 36,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3E3E3E",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 22,
  },
  searchContainer: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3E3E3E",
    marginBottom: 25,
  },
  searchInput: { flex: 1, color: "#fff", marginLeft: 10 },
  card: {
    flexDirection: "row",
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  leftSection: {
    marginRight: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#A060FF",
    alignItems: "center",
    justifyContent: "center",
  },
  infoSection: { flex: 1 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  column: { flex: 1 },
  columnRight: { flex: 1, alignItems: "flex-end" },
  label: { color: "#B0B0B0", fontSize: 12, marginBottom: 2 },
  name: { color: "#fff", fontSize: 16, fontWeight: "600" },
  value: { color: "#EDEDED", fontSize: 14 },
  ratingContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
  rating: { color: "#FFD700", fontWeight: "bold", fontSize: 14 },
});

import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  FlatList,
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
    api
      .get("/users")
      .then((response) => {
        const onlyMusicians = response.data.filter(
          (user) => user.tipo === "musico"
        );

        setUsersList(onlyMusicians);
        setFilteredUsers(onlyMusicians);
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
          u.instrumentos.toLowerCase().includes(lower)
      );
      setFilteredUsers(filtered);
    }
  };

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

      {/* Recomendações */}
      <Text style={styles.sectionTitle}>Artistas Disponíveis</Text>

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

      <FlatList
  data={filteredUsers}
  keyExtractor={(item) => item.cpf}
  showsVerticalScrollIndicator={false}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/${item.cpf}`)}
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
              <Text style={styles.rating}>{4.5}</Text>
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
    justifyContent: "space-between",
  },
  appImage: {
    width: 118,
    height: 42,
  },
  settingsButton: {
    backgroundColor: "#2E2C30",
    width: 32,
    height: 32,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 32,
  },

  searchContainer: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    marginHorizontal: 10,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },

  // --- Card de Artista ---

  card: {
    flexDirection: "row",
    backgroundColor: "#1E1E2A",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  leftSection: {
    marginRight: 14,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#6C63FF",
    alignItems: "center",
    justifyContent: "center",
  },
  infoSection: {
    flex: 1,
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  column: {
    flex: 1,
  },
  columnRight: {
    flex: 1,
    // alignItems: "flex-end",
  },
  label: {
    color: "#A0A0A0",
    fontSize: 12,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  value: {
    color: "#EDEDED",
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    color: "#FFD700",
    fontWeight: "bold",
    fontSize: 14,
  },
});

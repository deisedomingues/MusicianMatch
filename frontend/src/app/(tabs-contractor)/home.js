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
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import api from "../api/api";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const [usersList, setUsersList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
          u.email.toLowerCase().includes(lower)
      );
      setFilteredUsers(filtered);
    }
  };

  const logout = () => {
    router.replace("/auth/login");
  };

  const handleEdit = () => router.push("/telas/editProfile");

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "#fff" }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#1E1E1E", "#473CA6", "#2F253E"]}
      style={styles.container}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleEdit}>
          <Image
            source={{ uri: "https://picsum.photos/200" }}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{user.nome}</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <Ionicons name="exit-outline" size={26} color="#f70707" />
        </TouchableOpacity>
      </View>

      {/* Saudação */}
      <Text style={styles.greeting}>Olá! 👋</Text>

      {/* Barra de pesquisa */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#ccc" />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquise"
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      {/* Recomendações */}
      <Text style={styles.sectionTitle}>Recomendações</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.recommendations}
      >
        {filteredUsers.length > 0 ? (
          filteredUsers.map((item, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.avatar}>
                <Image
                  source={{
                    uri: `https://avatar.iran.liara.run/username?username=${item.nome}`,
                  }}
                  style={styles.avatarImage}
                />
                <Text style={styles.cardTitle}>{item.nome}</Text>
              </View>
              <Text style={styles.cardText}>email: {item.email}</Text>
              <Text style={styles.cardText}>telefone: {item.telefone}</Text>
              <Text style={styles.cardText}>
                instrumentos: {item.instrumentos}
              </Text>
              <Text style={styles.cardText}>
                localização: {item.localizacao}
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ color: "#fff", marginTop: 20 }}>
            Nenhum usuário encontrado.
          </Text>
        )}
      </ScrollView>

      {/* Botão flutuante */}
      <TouchableOpacity style={styles.floatingButton}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    marginBottom: 25,
  },
  profileIcon: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    color: "#fff",
    fontSize: 16,
  },
  greeting: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
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
  recommendations: {
    flexGrow: 0,
  },
  card: {
    width: 300,
    height: 250,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 15,
    marginRight: 15,
    justifyContent: "center",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardText: {
    color: "#ccc",
    fontSize: 12,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 25,
    backgroundColor: "#5D3FD3",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  avatar: {
    marginRight: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});

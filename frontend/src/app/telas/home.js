import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import api from "../api/api";

export default function Home() {
  const [usersList, setUsersList] = useState([]);
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
      console.error(
        "Erro ao carregar dados do usuário do AsyncStorage:",
        error
      );
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
        setUsersList(response.data);
      })
      .catch((error) => {
        console.error("Erro ao obter dados do usuário:", error);
      });
  }, []);

  const handleEdit = () => {
    router.push("/telas/editProfile");
  };

  if (loading || !user) {
    return (
      <View style={styles.container}>
        <Text>Carregando dados do usuário...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>Olá, {user.nome}</Text>

        {/* Ícone de perfil */}
        <TouchableOpacity onPress={handleEdit}>
          <Image
            source={{ uri: "https://picsum.photos/id/237/200/300" }} // Fotografia
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>🙋‍♂️ Listagem de usuários</Text>

      {/* Informações*/}
      {usersList.map((item, index) => (
        <View key={index} style={styles.userInfo}>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.info}>{item.nome}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.info}>{item.email}</Text>

          <Text style={styles.label}>Telefone:</Text>
          <Text style={styles.info}>{item.telefone}</Text>
        </View>
      ))}

      {/* Botão de editar*/}
      <TouchableOpacity style={styles.button} onPress={handleEdit}>
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
  },
  userInfo: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 16,
  },
  info: {
    fontSize: 16,
    color: "#555",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

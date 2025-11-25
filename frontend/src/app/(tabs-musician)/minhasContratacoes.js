import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import api from "../api/api";
import Toast from "react-native-toast-message";

export default function MinhasContratacoes() {
  const [contratacoes, setContratacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    async function carregarContratacoes() {
      try {
        const userDataString = await AsyncStorage.getItem("userData");
        if (!userDataString) {
          Toast.show({
            type: "error",
            text1: "Erro",
            text2: "Usuário não encontrado. Faça login novamente.",
            position: "top",
          });
          return;
        }
        const userData = JSON.parse(userDataString);
        setUsuario(userData);

        // busca contratações onde o usuário logado é o CONTRATANTE
        const response = await api.get("/contratacoes");
        const todasContratacoes = response.data;

        const minhas = todasContratacoes.filter(
          (c) => c.cpf_contratante === userData.cpf
        );

        setContratacoes(minhas);
      } catch (error) {
        console.error("Erro ao carregar contratações:", error);
        Toast.show({
          type: "error",
          text1: "Erro",
          text2: "Não foi possível carregar contratações.",
          position: "top",
        });
      } finally {
        setLoading(false);
      }
    }

    carregarContratacoes();
  }, []);

  function renderItem({ item }) {
    return (
      <View style={styles.card}>
        <Text style={styles.nome}>{item.nome_musico}</Text>
        <Text style={styles.info}>Instrumentos: {item.instrumentos}</Text>
        <Text style={styles.info}>Data: {item.data_evento}</Text>
        <Text style={styles.info}>Horário: {item.horario}</Text>
        <Text style={styles.info}>Local: {item.localizacao}</Text>
        <Text style={styles.status}>Status: {item.status}</Text>

        {/* Só mostra botão de avaliar se usuário é contratante e status finalizado */}
        {usuario &&
          item.cpf_contratante === usuario.cpf &&
          item.status === "finalizado" && (
            <TouchableOpacity
              style={styles.botaoAvaliar}
              onPress={() =>
                router.push({
                  pathname: "/tabs-musician/avaliarMusico",
                  params: { cpfMusico: item.cpf_musico },
                })
              }
            >
              <Text style={styles.textoBotao}>Avaliar Músico</Text>
            </TouchableOpacity>
          )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Botão Home */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/tabs-musician/home")}
      >
        <Ionicons name="home" size={20} color="#fff" />
        <Text style={styles.backText}>Início</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Minhas Contratações</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#A020F0" />
      ) : contratacoes.length === 0 ? (
        <Text style={styles.info}>Você não possui contratações.</Text>
      ) : (
        <FlatList
          data={contratacoes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d", padding: 20 },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: 100,
  },
  backText: { color: "#fff", marginLeft: 10, fontSize: 16 },
  titulo: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1c1c1c",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  nome: { color: "#fff", fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  info: { color: "#aaa", fontSize: 14, marginBottom: 3 },
  status: { color: "#fff", fontSize: 14, marginTop: 5 },
  botaoAvaliar: {
    backgroundColor: "#A020F0",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  textoBotao: { color: "#fff", fontWeight: "bold" },
});

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import api from "../api/api";

export default function MusicianProfile() {
  const { cpf } = useLocalSearchParams();
  const [musician, setMusician] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api
      .get(`/users/${cpf}`) // ou /profile/${cpf}, conforme sua rota
      .then((response) => setMusician(response.data))
      .catch((error) => console.error("Erro ao carregar músico:", error))
      .finally(() => setLoading(false));
  }, [cpf]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A020F0" />
      </View>
    );
  }

  if (!musician) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "#fff" }}>Músico não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil do Músico</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={48} color="#fff" />
        </View>
        <Text style={styles.name}>{musician.nome}</Text>
        <Text style={styles.instrument}>{musician.instrumentos}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{musician.email}</Text>

        <Text style={styles.label}>Telefone</Text>
        <Text style={styles.value}>{musician.telefone}</Text>

        <Text style={styles.label}>Localização</Text>
        <Text style={styles.value}>{musician.localizacao}</Text>

        <Text style={styles.label}>Descrição</Text>
        <Text style={styles.value}>
          {musician.descricao || "Sem descrição."}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => router.push({
          pathname: "/(tabs-contractor)/contratar",
          params: {
            cpfMusico: musician.cpf,
            nomeMusico: musician.nome,
            instrumentosMusico: musician.instrumentos,
          },
        
        })
      }
      >
        <Text style={styles.mainButtonText}>Contratar</Text>
        <Ionicons name="person-add-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C0633",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1C0633",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#2a0a4d",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  instrument: {
    color: "#A084DC",
    fontSize: 16,
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: "#2a0a4d",
    borderRadius: 12,
    padding: 16,
  },
  label: {
    color: "#A084DC",
    fontSize: 14,
    marginTop: 10,
  },
  value: {
    color: "#fff",
    fontSize: 16,
    marginTop: 2,
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

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
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
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loadingMusico, setLoadingMusico] = useState(true);
  const [loadingAvaliacoes, setLoadingAvaliacoes] = useState(true);
  const router = useRouter();

  const loadMusicianData = async () => {
    try {
      setLoadingMusico(true);
      const resMusico = await api.get(`/musicos/${cpf}`);
      setMusician(resMusico.data || null);
    } catch (error) {
      console.error("Erro ao carregar músico:", error);
    } finally {
      setLoadingMusico(false);
    }
  };

  const loadAvaliacoes = async () => {
    try {
      setLoadingAvaliacoes(true);
      const resAvaliacoes = await api.get(`/avaliacoes/musico/${cpf}`);
      const list = Array.isArray(resAvaliacoes.data) ? resAvaliacoes.data : [];
      setAvaliacoes(list);
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
    } finally {
      setLoadingAvaliacoes(false);
    }
  };

  useEffect(() => {
    loadMusicianData();
    loadAvaliacoes();
  }, [cpf]);

  if (loadingMusico) {
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
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.mainButton, { marginTop: 20 }]}
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
          <Text style={styles.mainButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const instrumentosFormatados = Array.isArray(musician.instrumentos)
    ? musician.instrumentos.join(", ")
    : musician.instrumentos || "";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil do Músico</Text>
      </View>

      {/* Profile */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={52} color="#fff" />
        </View>
        <Text style={styles.name}>{musician.nome}</Text>
        <Text style={styles.instrument}>{instrumentosFormatados}</Text>
        <Text style={styles.location}>{musician.localizacao || "—"}</Text>
      </View>

      {/* Informações */}
      <View style={styles.infoBox}>
        <Info label="Email" value={musician.email || "—"} />
        <Info
          label="Descrição"
          value={musician.bio || musician.descricao || "Sem descrição."}
        />
        <Info label="Avaliação média" value={musician.nota_media} />
      </View>

      {/* Avaliações (carrossel horizontal) */}
      <Text style={styles.sectionTitle}>Avaliações recebidas</Text>
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
                    name={n <= (av.nota || 0) ? "star" : "star-outline"}
                    size={20}
                    color="#FFD700"
                  />
                ))}
              </View>
              <Text style={styles.avaliacaoComentario}>
                {av.comentario || "Sem comentário"}
              </Text>
              <Text style={styles.avaliacaoAutor}>
                Por: {av.contratante_nome || "Anônimo"}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Botão Contratar (músico também contrata) */}
      <TouchableOpacity
        style={styles.mainButton}
        onPress={() =>
          router.push({
            pathname: "/(tabs-musician)/contratar",
            params: {
              cpfMusico: musician.cpf,
              nomeMusico: musician.nome,
              instrumentosMusico: instrumentosFormatados,
            },
          })
        }
      >
        <Ionicons name="musical-note-outline" size={22} color="#fff" />
        <Text style={styles.mainButtonText}>Contratar Músico</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Info({ label, value }) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#160427", paddingHorizontal: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#160427",
  },
  header: { flexDirection: "row", alignItems: "center", paddingVertical: 20 },
  backButton: { marginRight: 10 },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  profileCard: { alignItems: "center", paddingVertical: 25, marginBottom: 20 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#3A0E5A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  name: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  instrument: { color: "#BC9CFF", fontSize: 16, marginTop: 4 },
  location: { color: "#aaa", fontSize: 14, marginTop: 2 },
  infoBox: {
    backgroundColor: "#2b0e47",
    padding: 20,
    borderRadius: 14,
    marginTop: 10,
    marginBottom: 25,
  },
  label: { color: "#BC9CFF", fontSize: 14, marginBottom: 3 },
  value: { color: "#fff", fontSize: 16, fontWeight: "500" },
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
    flexDirection: "row",
    backgroundColor: "#7B1FA2",
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  mainButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

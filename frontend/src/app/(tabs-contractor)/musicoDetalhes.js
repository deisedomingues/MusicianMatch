// src/app/(tabs-contractor)/musicoDetalhes.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import api from "../api/api";

export default function MusicoDetalhes() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const musicoId = params.id;

  const [musico, setMusico] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (!musicoId) {
          Alert.alert("Erro", "ID do músico não informado.");
          router.back();
          return;
        }

        const { data } = await api.get(`/musicos/${musicoId}`);
        setMusico(data);
      } catch (err) {
        console.error(err);
        Alert.alert("Erro", "Não foi possível carregar o músico.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleContratar = () => {
    router.push({
      pathname: "/(tabs-contractor)/novaContratacao",
      params: { musicoId: musico.id },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#A060FF" size="large" />
      </View>
    );
  }

  if (!musico) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Músico não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Voltar */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={20} color="#fff" />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      {/* Card principal */}
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={42} color="#fff" />
        </View>

        <Text style={styles.name}>{musico.nome}</Text>

        <View style={styles.infoBlock}>
          <Text style={styles.labelTitle}>Instrumentos</Text>
          <Text style={styles.value}>
            {Array.isArray(musico.instrumentos)
              ? musico.instrumentos.join(", ")
              : musico.instrumentos}
          </Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.labelTitle}>Localização</Text>
          <Text style={styles.value}>{musico.localizacao}</Text>
        </View>

        {musico.descricao && (
          <View style={styles.infoBlock}>
            <Text style={styles.labelTitle}>Sobre</Text>
            <Text style={styles.value}>{musico.descricao}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleContratar}>
          <Text style={styles.buttonText}>Contratar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: 100,
  },

  backText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 16,
  },

  // CARD
  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 14,
    padding: 24,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#A060FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  infoBlock: {
    width: "100%",
    marginBottom: 16,
  },

  labelTitle: {
    color: "#B0B0B0",
    fontSize: 14,
    marginBottom: 4,
  },

  value: {
    color: "#EDEDED",
    fontSize: 16,
  },

  // BUTTON
  button: {
    marginTop: 16,
    backgroundColor: "#871F78",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

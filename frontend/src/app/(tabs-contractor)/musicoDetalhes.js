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
    // Aqui você envia para a tela de criação de contratação
    router.push({
      pathname: "/(tabs-contractor)/novaContratacao",
      params: { musicoId: musico.id },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#fff" size="large" />
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
    <View style={styles.container}>
      <Text style={styles.title}>{musico.nome}</Text>
      <Text style={styles.label}>Instrumentos: {musico.instrumentos.join(", ")}</Text>
      <Text style={styles.label}>Localização: {musico.localizacao}</Text>

      <TouchableOpacity style={styles.button} onPress={handleContratar}>
        <Text style={styles.buttonText}>Contratar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A181D", padding: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  label: { color: "#fff", fontSize: 16, marginBottom: 8 },
  button: { marginTop: 20, backgroundColor: "#0B8A1F", padding: 12, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  emptyText: { color: "#aaa", textAlign: "center", marginTop: 40 },
});

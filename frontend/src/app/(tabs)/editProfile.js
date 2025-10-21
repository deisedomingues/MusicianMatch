import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "../api/api";
import { LinearGradient } from "expo-linear-gradient";

export default function EditarPerfil() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userData, setUserData] = useState({
    nome: "",
    telefone: "",
    email: "",
    cpf: "",
  });

  useEffect(() => {
    const loadCurrentData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem("userData");
        if (userDataString) {
          const storedData = JSON.parse(userDataString);
          setUserData({
            nome: storedData.nome || "",
            telefone: storedData.telefone || "",
            email: storedData.email || "",
            cpf: storedData.cpf || "",
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados para edição:", error);
        Alert.alert(
          "Erro",
          "Não foi possível carregar seus dados para edição."
        );
      } finally {
        setLoading(false);
      }
    };
    loadCurrentData();
  }, []);

  const handleChange = (name, value) => {
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    const token = await AsyncStorage.getItem("userToken");
    const { cpf } = JSON.parse(await AsyncStorage.getItem("userData"));

    if (!token) {
      Alert.alert(
        "Erro de Autenticação",
        "Usuário não autenticado. Faça login novamente."
      );
      router.replace("/auth/login");
      return;
    }

    try {
      const response = await api.put(`/profile/${cpf}`, userData, {
        headers: { Authorization: `${token}` },
      });

      const updatedUser = response.data.usuario;
      const oldDataString = await AsyncStorage.getItem("userData");
      const oldData = oldDataString ? JSON.parse(oldDataString) : {};
      const finalUserData = { ...oldData, ...updatedUser };

      await AsyncStorage.setItem("userData", JSON.stringify(finalUserData));
      Alert.alert("Sucesso", "Seus dados foram atualizados com sucesso!");
      router.replace("/telas/home");
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Ocorreu um erro ao salvar as alterações.";
      Alert.alert("Erro", errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    if (Platform.OS === "web") {
      if (
        window.confirm(
          "Tem certeza que deseja DELETAR permanentemente sua conta? Esta ação é irreversível."
        )
      ) {
        confirmDelete();
      }
    } else {
      Alert.alert(
        "Confirmar Exclusão",
        "Tem certeza que deseja DELETAR permanentemente sua conta? Esta ação é irreversível.",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Sim, Deletar",
            onPress: confirmDelete,
            style: "destructive",
          },
        ],
        { cancelable: false }
      );
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    const token = await AsyncStorage.getItem("userToken");
    const { cpf } = JSON.parse(await AsyncStorage.getItem("userData"));

    if (!token) {
      Alert.alert("Erro", "Sessão expirada. Faça login novamente.");
      await AsyncStorage.clear();
      router.replace("/auth/login");
      return;
    }

    try {
      await api.delete(`/profile/${cpf}`, {
        headers: { Authorization: `${token}` },
      });

      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");

      Alert.alert(
        "Sucesso",
        "Sua conta foi deletada com sucesso. Sentiremos sua falta!"
      );
      router.replace("/auth/login");
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Ocorreu um erro ao tentar deletar a conta.";
      Alert.alert("Erro", errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#1E1E1E", "#473CA6", "#2F253E"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: "8%", paddingTop: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Editar Perfil</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={userData.nome}
              onChangeText={(text) => handleChange("nome", text)}
              placeholder="Nome completo"
              placeholderTextColor="#FFFFFF80"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.textInput, styles.readOnlyInput]}
              value={userData.email}
              editable={false}
              placeholderTextColor="#FFFFFF80"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.textInput, styles.readOnlyInput]}
              value={userData.cpf}
              editable={false}
              placeholderTextColor="#FFFFFF80"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={userData.telefone}
              onChangeText={(text) => handleChange("telefone", text)}
              placeholder="Telefone"
              placeholderTextColor="#FFFFFF80"
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleUpdate}
            disabled={isUpdating}
          >
            <Text style={styles.buttonText}>
              {isUpdating ? "Salvando..." : "Salvar Alterações"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
            disabled={isUpdating || isDeleting}
          >
            <Text style={[styles.buttonText, styles.deleteButtonText]}>
              {isDeleting ? "Deletando..." : "Deletar Perfil"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: "rgba(38, 0, 0, 0.2)",
    borderRadius: 25,
    marginVertical: 10,
    paddingHorizontal: 20,
    height: 60,
    justifyContent: "center",
  },
  textInput: {
    color: "#fff",
    fontSize: 16,
  },
  readOnlyInput: {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#ccc",
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 15,
    elevation: 5,
  },
  buttonText: {
    color: "#463BA2",
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#D32F2F",
  },
  deleteButtonText: {
    color: "#D32F2F",
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 20,
    padding: 15,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

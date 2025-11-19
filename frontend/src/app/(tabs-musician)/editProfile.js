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
import { Ionicons } from "@expo/vector-icons";

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

  const logout = () => {
    router.replace("/auth/login");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Editar Perfil</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nome de Usuário</Text>
        <TextInput
          style={styles.input}
          value={userData.nome}
          onChangeText={(text) => handleChange("nome", text)}
          placeholder="Digite seu nome"
          placeholderTextColor="#aaa"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          keyboardType="email-address"
          value={userData.email}
          editable={false}
          placeholderTextColor="#aaa"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          placeholder="(00) 00000-0000"
          value={userData.telefone}
          onChangeText={(text) => handleChange("telefone", text)}
          keyboardType="phone-pad"
          placeholderTextColor="#aaa"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          editable={false}
          secureTextEntry
          placeholderTextColor="#aaa"
        />
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleUpdate}
        disabled={isUpdating}
      >
        <Text style={styles.saveButtonText}>
          {isUpdating ? "Salvando..." : "Salvar Alterações"}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          height: 1,
          width: 100,
          backgroundColor: "#707070ff",
          marginBottom: 24,
          marginTop: 24,
        }}
      />

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        disabled={isUpdating || isDeleting}
      >
        <Text style={styles.deleteButtonText}>
          {isDeleting ? "Deletando..." : "Deletar Perfil"}
        </Text>
      </TouchableOpacity>

      <View
        style={{
          height: 1,
          width: 100,
          backgroundColor: "#707070ff",
          marginBottom: 24,
          marginTop: 24,
        }}
      />

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Sair</Text>
        <Ionicons name="exit-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#1A181D",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginVertical: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    color: "#B0B0B0",
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#1C1C1E",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#3E3E3E",
  },
  saveButton: {
    backgroundColor: "#6C1BC8",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#B82020",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#00000005",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#3E3E3E",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

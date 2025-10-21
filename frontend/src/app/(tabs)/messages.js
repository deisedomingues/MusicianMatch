import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
} from "react-native";

const messages = [
  {
    id: "1",
    user: "Nome usuário",
    message: "Mensagem",
    time: "minutos",
    photo: "https://avatar.iran.liara.run/public",
  },
  {
    id: "2",
    user: "Nome usuário",
    message: "Mensagem",
    time: "minutos",
    photo: "https://avatar.iran.liara.run/public/girl",
  },
  {
    id: "3",
    user: "Nome usuário",
    message: "Mensagem",
    time: "minutos",
    photo: "https://avatar.iran.liara.run/public/boy",
  },
  {
    id: "4",
    user: "Nome usuário",
    message: "Mensagem",
    time: "minutos",
    photo: "https://avatar.iran.liara.run/public/girl",
  },
  {
    id: "5",
    user: "Nome usuário",
    message: "Mensagem",
    time: "minutos",
    photo: "https://avatar.iran.liara.run/username?username=Deise",
  },
];

export default function Mensagens() {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.avatar}>
        <Image
          source={{ uri: item.photo }} // Substitua por um avatar real ou ícone
          style={styles.avatarImage}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.username}>{item.user}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mensagens</Text>
      <TextInput
        placeholder="Pesquise"
        placeholderTextColor="#999"
        style={styles.searchInput}
      />
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e2f",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: "#2c2c3f",
    color: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3b3b5e",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  avatar: {
    marginRight: 15,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flex: 1,
  },
  username: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  message: {
    color: "#ccc",
    marginTop: 4,
  },
  time: {
    color: "#999",
    fontSize: 12,
  },
});

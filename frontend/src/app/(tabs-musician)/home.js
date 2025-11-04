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
  return (
    <LinearGradient
      colors={["#1E1E1E", "#473CA6", "#2F253E"]}
      style={styles.container}
    >
      <Text>Home musico</Text>
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

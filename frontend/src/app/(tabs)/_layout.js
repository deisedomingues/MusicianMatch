import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // esconde o topo
        tabBarShowLabel: true, // oculta os nomes
        tabBarStyle: {
          // position: "absolute",
          // bottom: 15,
          // left: 20,
          // right: 20,
          backgroundColor: "#1C0633",
          height: 60,
          borderTopWidth: 0,
          elevation: 5,
        },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#a084dc",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Início",
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Mensagens",
          tabBarIcon: ({ color, size = 24 }) => (
            <Ionicons name="chatbubbles" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="editProfile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size = 24 }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

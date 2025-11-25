import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
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
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="editProfile"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="listMusicians"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="musicianProfile"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="contratar"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="musicoDetalhes"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="[cpf]"
        options={{
          href: null,
        }}
      />
      
      <Tabs.Screen
        name="minhasContratacoes"
        options={{
          title: "Contratações",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-number-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="avaliarMusico"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

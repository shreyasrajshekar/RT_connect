// AddName.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function AddName({ onContinue }) {
  const [username, setUsername] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome To RT_Connect</Text>
      <Text style={styles.subtitle}>Enter your name to join the chat</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="e.g. Raj"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => username.trim() && onContinue(username)}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#4a90e2" },
  title: { fontSize: 26, fontWeight: "bold", color: "white", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "white", marginBottom: 20 },
  input: { width: "80%", backgroundColor: "white", borderRadius: 10, padding: 12, marginBottom: 20, fontSize: 16 },
  button: { backgroundColor: "#2ecc71", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 10 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});

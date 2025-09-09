// ChatScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import NetInfo from "@react-native-community/netinfo";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "./Notification";

export default function ChatScreen({ username }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(true);
  const [expoPushToken, setExpoPushToken] = useState("");

  // 🔔 Register for push notifications
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) setExpoPushToken(token);
    });
  }, []);

  // ✅ Network check
  useEffect(() => {
    const unsubscribeNet = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    // ✅ Firestore subscription
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribeMsg = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(newMessages);

      // 🔔 Show local notification when new message comes
      if (newMessages.length > 0) {
        const lastMsg = newMessages[newMessages.length - 1];
        if (lastMsg.sender !== username) {
          Notifications.scheduleNotificationAsync({
            content: {
              title: `${lastMsg.sender}`,
              body: lastMsg.text,
            },
            trigger: null,
          });
        }
      }
    });

    return () => {
      unsubscribeNet();
      unsubscribeMsg();
    };
  }, []);

  // ✅ Send message
  const sendMessage = async () => {
    if (!input.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: input,
      timestamp: serverTimestamp(),
      sender: username,
    });

    setInput("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* ⚠️ Offline Popup */}
      <Modal transparent={true} visible={!isConnected} animationType="fade">
        <View style={styles.offlineOverlay}>
          <View style={styles.offlinePopup}>
            <Text style={{ color: "white", fontSize: 16 }}>
              ⚠️ You are not connected to the internet
            </Text>
          </View>
        </View>
      </Modal>

      {/* ✅ Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.sender === username ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <Text style={styles.senderName}>
              {item.sender === username ? "You" : item.sender}
            </Text>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 10, paddingBottom: 80 }}
      />

      {/* ✅ Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },

  messageBubble: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "75%",
  },
  myMessage: { backgroundColor: "#4a90e2", alignSelf: "flex-end" },
  otherMessage: { backgroundColor: "#e5e5ea", alignSelf: "flex-start" },

  senderName: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#444",
  },
  messageText: { fontSize: 16, color: "#000" },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  input: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#4a90e2",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendText: { color: "white", fontWeight: "bold" },

  offlineOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  offlinePopup: { backgroundColor: "red", padding: 20, borderRadius: 10 },
});

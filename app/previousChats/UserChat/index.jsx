import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";

const UserChat = () => {
  const { chat } = useLocalSearchParams();
  const parsedChat = chat ? JSON.parse(chat) : null; // Parse the chat parameter

  const messages = parsedChat?.chat?.messages;

  console.log("parsed", parsedChat);

  function handleBack() {
    router.back();
  }

  const formatTimestamp = (timestamp) => {
    // Assuming timestamp is in seconds
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleString(); // Adjust date formatting as per requirement
  };

  const timeStamp = formatTimestamp(parsedChat?.timestamp);

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={[styles.button, styles.blueButton]}
          onPress={handleBack}
        >
          <Image
            source={require("../../../assets/images/back.png")}
            style={styles.image}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.heading}>{messages[2]?.content}</Text>
        </View>
        <View>
          <Text style={styles.chatUser}>{timeStamp}</Text>
        </View>
      </View>
      <ScrollView style={styles.chatContainer}>
        {messages.slice(1).map((msg, index) => (
          <View
            key={index}
            style={[
              styles.chatSession,
              msg.role === "user" ? styles.userMessage : styles.agentMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                msg.role === "user"
                  ? styles.userMessageText
                  : styles.agentMessageText,
              ]}
            >
              {msg.content}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default UserChat;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    height: "100%",
    backgroundColor: "rgb(241, 245, 249)",
  },
  userMessageText: {
    color: "white",
  },

  agentMessageText: {
    color: "#796AAA",
  },

  chatContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    flex: 1,
    padding: "20px",
  },
  chatSession: {
    borderRadius: 10,
    shadowColor: "rgba(9, 14, 29, 0.05)",
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 5,
    backgroundColor: "white",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginVertical: 5,
  },
  bottomContainer: {
    padding: "20px",
    maxHeight: "60%",
  },
  topContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    borderWidth: 1,
    backgroundColor: "#796AAA",
    padding: 10,
    paddingBottom: "4rem",
    paddingTop: "4rem",
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
  },
  toggleBtn: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    borderRadius: 10,
  },
  activeToggle: {
    backgroundColor: "rgb(121, 106, 170)",
  },
  activeText: {
    color: "white",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontSize: 16,
    fontWeight: "700",
  },
  heading: {
    color: "#FFFFFF",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontSize: 30,
    fontWeight: "700",
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  textContainer: {
    color: "rgb(121, 106, 170)",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontSize: 16,
    fontWeight: "700",
  },
  chatUser: {
    color: "white",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontSize: 18,
    fontWeight: "600",
  },
  messageText: {
    fontSize: 16,
  },
  button: {
    padding: 10,
  },
  image: {
    width: 40,
    height: 40,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#097E8B",
  },
  agentMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E2E8F0",
  },
});

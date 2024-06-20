import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { fetchChat } from "../../API/ApiHandler";

const ToggleOption = {
  lastWeek: "lastWeek",
  earlier: "earlier",
};

const PreviousChatList = () => {
  const [toggle, setToggle] = useState(ToggleOption.lastWeek);
  const [messages, setMessages] = useState([]);

  function handleBack() {
    router.back();
  }

  function handleToggle(option) {
    setToggle(option);
  }

  useEffect(() => {
    getChatHistory();
  }, []);

  async function getChatHistory() {
    try {
      const mobile = await AsyncStorage.getItem("mobileNumber");
      const response = await axios.get(`${fetchChat}/${mobile}`);
      console.log(response.data);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={[styles.button, styles.blueButton]}
          onPress={handleBack}
        >
          <Image
            source={require("../../assets/images/back.png")}
            style={styles.image}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.heading}>My Previous Checks</Text>
        </View>
        <View style={styles.flexRow}>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              toggle === ToggleOption.earlier && styles.activeToggle,
            ]}
            onPress={() => handleToggle(ToggleOption.earlier)}
          >
            <Text
              style={[toggle === ToggleOption.earlier && styles.activeText]}
            >
              Earlier
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              toggle === ToggleOption.lastWeek && styles.activeToggle,
            ]}
            onPress={() => handleToggle(ToggleOption.lastWeek)}
          >
            <Text
              style={[toggle === ToggleOption.lastWeek && styles.activeText]}
            >
              Last Week
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Chat container */}
      <View style={styles.bottomContainer}>
        <Text style={[styles.textContainer, { margin: 10 }]}>
          {toggle === ToggleOption.lastWeek ? "Last Week" : "Earlier"}
        </Text>
        <ChatContainer messages={messages} />
      </View>
    </View>
  );
};

const ChatContainer = ({ messages }) => {
  console.log(messages);
  function chatHandler(chat) {
    console.log("chat is", chat);
    router.push({
      pathname: "/previousChats/UserChat",
      params: { chat: JSON.stringify(chat) }, // Stringify the chat object
    });
  }
  return (
    <ScrollView contentContainerStyle={styles.chatContainer}>
      {messages.map((chatSession, index) => (
        <TouchableOpacity
          onPress={() => {
            chatHandler(chatSession);
          }}
          key={index}
          style={styles.chatSession}
        >
          <Text style={styles.chatUser}>
            {chatSession?.chat?.messages[2]?.content
              ? chatSession?.chat?.messages[2]?.content
              : "No message"}
          </Text>
          <Text style={styles.timestamp}>
            {formatTimestamp(chatSession.timestamp)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const formatTimestamp = (timestamp) => {
  // Assuming timestamp is in seconds
  const date = new Date(timestamp._seconds * 1000);
  return date.toLocaleString(); // Adjust date formatting as per requirement
};

export default PreviousChatList;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    height: "100%",
    backgroundColor: "rgb(241, 245, 249)",
  },
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flex: 1, // or flex: 1
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
  },
  bottomContainer: {
    padding: "20px",
    // height: "100%",
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
    color: "rgb(121, 106, 170)",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontSize: 18,
    fontWeight: "600",
  },
});

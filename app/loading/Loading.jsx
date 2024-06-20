import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Link, router } from "expo-router";

const Loading = ({ navigation }) => {
  const [loaderWidth, setLoaderWidth] = useState(0);

  // Function to anim loader
  useEffect(() => {
    const interval = setInterval(() => {
      setLoaderWidth((prevWidth) => (prevWidth < 100 ? prevWidth + 25 : 0));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    router.push("/ai/Home");
  };

  return (
    <View style={styles.container}>
      {/* Image in the center */}
      <Image
        source={require("../../assets/images/loading_image.png")}
        style={styles.image}
      />

      {/* Heading */}
      <Text style={styles.heading}>Limitations</Text>

      {/* Description */}
      <Text style={styles.description}>
        No chatbots is perfect. Just like human beings! Physio247 AI’s knowledge
        is limited to 2023 and provides only a provisional diagnosis!
      </Text>

      {/* Loader */}
      <View style={styles.loader}>
        <View style={[styles.loaderLine, { width: `${loaderWidth}%` }]} />
      </View>

      {/* Create Conversation button */}
      <TouchableOpacity
        style={styles.createConversationButton}
        onPress={handleClick}
      >
        <Text style={styles.createConversationText}>Create Conversation</Text>
        <Image
          source={require("../../assets/images/plus_icon.png")}
          style={styles.plusIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BFDBFE",
    marginTop: -150,
    marginBottom: -50,
  },
  image: {
    width: 400,
    height: 400,
    marginBottom: 20,
    marginTop: 80,
  },
  heading: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#796AAA",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    color: "#796AAA",
  },
  loader: {
    width: "90%",
    height: 10,
    backgroundColor: "#BFDBFE",
    borderRadius: 5,
    marginBottom: 40,
  },
  loaderLine: {
    height: "100%",
    backgroundColor: "#1E64FA",
    borderRadius: 5,
  },
  createConversationButton: {
    backgroundColor: "#1E64FA",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 70,
    paddingVertical: 20,
  },
  createConversationText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  plusIcon: {
    width: 20,
    height: 20,
    tintColor: "#FFFFFF",
  },
});

export default Loading;

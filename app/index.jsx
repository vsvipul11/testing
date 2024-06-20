import React from "react";
import { router } from "expo-router";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const handleGetStarted = () => {
  router.push("signup/Signup");
};

const handleSignIn = () => {
  router.push("login/Login");
};

const Index = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../assets/images/plus.png")}
        style={styles.logo}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Welcome to</Text>
        <Text style={[styles.titleText]}>Physio247</Text>
      </View>
      <Image
        source={require("../assets/images/home.png")}
        style={styles.image}
      />
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started </Text>
        <Image
          source={require("../assets/images/arrow.png")}
          style={styles.arrowIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignIn}>
        <Text style={styles.signInText}>
          Already have an account? <Text style={styles.blueText}>Sign in</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 70,
    height: 70,
  },
  titleContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
  },
  titleText: {
    color: "#796AAA",
    fontSize: 38,
    fontWeight: "bold",
  },
  blueText: {
    color: "#097E8B",
    marginBottom: 30,
    fontWeight: "700",
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#1E293B",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: "#FFFFFF",
  },
  signInText: {
    color: "#796AAA",
    fontSize: 16,
    marginTop: 20,
    fontSize: 18,
    fontWeight: "500",
  },
});

export default Index;

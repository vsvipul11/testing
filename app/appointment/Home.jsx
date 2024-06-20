import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Link, router } from "expo-router";

const Home = ({ navigation }) => {
  const handleBackPress = () => {
    router.push("/home/Home");
  };
  const handleButton = () => {
    router.push("/doctorList/DoctorList");
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Image
          source={require("../../assets/images/back.png")}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      <Image
        source={require("../../assets/images/appointmentBanner.png")}
        style={styles.image}
      />

      {/* Heading */}
      <Text style={styles.heading}>Your Appointments</Text>

      {/* Description */}
      <Text style={styles.description}>
        You have no doctor appointments. Please schedule a new one and get
        healthy ASAP.
      </Text>

      {/* Check Symptom button */}
      <TouchableOpacity style={styles.checkButton} onPress={handleButton}>
        <Text style={styles.checkButtonText}>Schedule New Appointment</Text>
        <Image
          source={require("../../assets/images/arrow.png")}
          style={styles.arrowIcon}
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
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1, // Ensures the button stays on top
  },
  backIcon: {
    width: 40,
    height: 40,
  },
  image: {
    width: 350,
    height: 350,
    marginBottom: 40,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#796AAA",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#796AAA",
    fontWeight: "200",
    padding: 20,
    marginBottom: 20,
  },
  checkButton: {
    backgroundColor: "#097E8B",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 70,
    paddingVertical: 15,
    width: "90%",
  },
  checkButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
    flexWrap: "nowrap",
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: "#FFFFFF",
  },
});

export default Home;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function Home() {
  const [userDetails, setUserDetails] = useState({});
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const loginDetails = await AsyncStorage.getItem("loginData");
        if (loginDetails !== null) {
          setUserDetails(JSON.parse(loginDetails));
        }
      } catch (error) {
        console.error("Failed to fetch profile name:", error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      const baseUrl = `https://uat-physio-tattva.p7devs.com/appointment/?phone_number=${userDetails?.caller_mobile}`;

      await axios.get(baseUrl).then((response) => {
        console.log("res", response);
        setAppointments(response.data.upcoming_appointments);
      });
    };

    if (userDetails.caller_mobile) {
      fetchAppointments();
    }
  }, [userDetails]);

  const handleCreateConversation = () => {
    router.push("/symptomchecker/Home");
  };

  function handlePreviousChecks() {
    router.push("/previousChats");
  }

  const handleAppointment = () => {
    router.push("/appointment/Home");
  };

  console.log("user", userDetails);

  function handleShowAppointment() {
    router.push("/appointmentList");
  }

  const renderAppointment = ({ item }) => (
    <View style={styles.appointmentCard}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../../assets/images/doc.png")}
          style={styles.image}
        />
        <Text style={styles.doctorName}>{item.doctor_name}</Text>
      </View>
      <Text style={{ color: "#796AAA" }}>{item.consultation_type}</Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../../assets/images/rescheduled.png")}
          style={styles.cardRowImage}
        />
        <Text style={{ color: "#796AAA" }}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={require("../../assets/images/ProfilePic.png")}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.profileName}>
            Hi {userDetails?.caller_name || "User"}! 👋
          </Text>
          <View style={styles.membershipContainer}>
            {/* <Text style={styles.starEmoji}>⭐</Text> */}
            {/* <Text style={styles.proMemberText}>Pro Member</Text> */}
          </View>
        </View>
        <TouchableOpacity style={styles.notificationIcon}>
          <Ionicons name="notifications" size={24} color="#796AAA" />
        </TouchableOpacity>
      </View>
      <View style={styles.symptomCheckerContainer}>
        <Text style={styles.symptomCheckerText}>AI Symptom Checker</Text>
        <View style={styles.blueContainer}>
          <TouchableOpacity
            style={styles.createConversationButton}
            onPress={handleCreateConversation}
          >
            <Text style={styles.createConversationButtonText}>
              Create Conversation
            </Text>
            <Image
              source={require("../../assets/images/plus.png")}
              style={styles.plusImage}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createConversationButton}
            onPress={handlePreviousChecks}
          >
            <Text style={styles.createConversationButtonText}>
              Previous Checks
            </Text>
            <Image
              source={require("../../assets/images/link.png")}
              style={styles.plusImage}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.consultationContainer}>
        <Text style={styles.consultationText}>Virtual Consultation</Text>
        <View style={styles.whiteCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>Appointment</Text>
            <TouchableOpacity onPress={handleAppointment}>
              <Image
                source={require("../../assets/images/link.png")}
                style={styles.arrowImage}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.cardRow}>
            <View style={styles.cardRowItem}>
              <Image
                source={require("../../assets/images/upcoming.png")}
                style={styles.cardRowImage}
              />
              <Text>Upcoming</Text>
            </View>
            <View style={styles.cardRowItem}>
              <Image
                source={require("../../assets/images/cancalled.png")}
                style={styles.cardRowImage}
              />
              <Text>Cancelled</Text>
            </View>
            <View style={styles.cardRowItem}>
              <Image
                source={require("../../assets/images/rescheduled.png")}
                style={styles.cardRowImage}
              />
              <Text>Rescheduled</Text>
            </View>
          </View>
          <View style={styles.greyCard}>
            <FlatList
              horizontal
              data={appointments}
              renderItem={renderAppointment}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={<Text>No Appointments for this date</Text>}
              contentContainerStyle={{ gap: 20 }}
            />
          </View>
          <TouchableOpacity onPress={handleShowAppointment}>
            <Text style={styles.showAppointment}>See All Appointments</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F1F5F9",
  },
  showAppointment: {
    textAlign: "center",
    color: "#097E8B",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 2,
    padding: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileName: {
    fontSize: 20,
    marginLeft: 20,
    fontWeight: "bold",
    color: "#796AAA",
  },
  membershipContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  starEmoji: {
    fontSize: 20,
    marginLeft: 5,
  },
  proMemberText: {
    marginLeft: 6,
  },
  notificationIcon: {
    marginLeft: "auto",
  },
  symptomCheckerContainer: {
    marginTop: 30,
    padding: 20,
    marginBottom: 0,
  },
  symptomCheckerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#796AAA",
  },
  blueContainer: {
    backgroundColor: "#097E8B",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    borderRadius: 10,
    gap: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  createConversationButton: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    width: "100%",
    justifyContent: "center",
    borderRadius: 10,
  },
  createConversationButtonText: {
    color: "black",
    fontWeight: "bold",
    marginRight: 10,
  },
  plusImage: {
    width: 30,
    height: 30,
  },
  consultationContainer: {
    padding: 20,
  },
  consultationText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#796AAA",
  },
  whiteCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  cardHeaderText: {
    fontSize: 22,
    color: "#796AAA",
  },
  arrowImage: {
    width: 40,
    height: 40,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardRowItem: {
    alignItems: "center",
  },
  cardRowImage: {
    width: 20,
    height: 20,
    marginBottom: 5,
  },
  greyCard: {
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    marginTop: 15,
    padding: 5,
  },
  appointmentCard: {
    width: 300, // Adjust width for horizontal scroll
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#796AAA",
  },
  cardRowImage: {
    width: 20,
    height: 20,
    marginBottom: 5,
  },
});

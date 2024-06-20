import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";

const AppointmentScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [selectedDateIndex, setSelectedDateIndex] = useState(0); // State to track selected date index

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

  useEffect(() => {
    filterAppointmentsByDate(selectedDate);
  }, [selectedDate, appointments]);

  console.log(filteredAppointments);

  const filterAppointmentsByDate = (date) => {
    const formattedDate = moment(date).format("DD MMMM YYYY");
    const filtered = appointments?.filter(
      (appointment) => appointment.formatted_startdate === formattedDate
    );
    setFilteredAppointments(filtered);
  };

  const renderDatePicker = () => {
    const today = moment();
    const daysInMonth = moment().daysInMonth();
    const todayDate = today.date();
    const remainingDaysInMonth = daysInMonth - todayDate + 1; // include today

    const datesArray = Array.from({ length: remainingDaysInMonth }, (v, k) =>
      today.clone().add(k, "days")
    );

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.datePickerContainer}
      >
        {datesArray.map((date, index) => (
          <TouchableOpacity
            key={date}
            onPress={() => {
              setSelectedDate(date.toDate());
              setSelectedDateIndex(index); // Set selected date index
            }}
            style={[
              styles.dateButton,
              selectedDateIndex === index && {
                backgroundColor: "#097E8B",
              },
            ]}
          >
            <Text
              style={[
                styles.dayText,
                selectedDateIndex === index && {
                  color: "white",
                },
              ]}
            >
              {date.format("ddd")}
            </Text>
            <Text
              style={[
                styles.dateText,
                selectedDateIndex === index && {
                  color: "white",
                },
              ]}
            >
              {date.format("DD")}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

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

  function handleBack() {
    router.back();
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={handleBack}>
          <Image
            source={require("../../assets/images/back.png")}
            style={styles.image}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.heading}>My Appointments</Text>
        </View>
      </View>

      <View style={styles.datePickerMainContainer}>{renderDatePicker()}</View>
      <View style={styles.appointmentContainer}>
        <Text style={styles.textContainer}>All Appointments</Text>

        <View style={styles.appointmentListContainer}>
          <FlatList
            data={filteredAppointments}
            renderItem={renderAppointment}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text>No Appointments for this date</Text>}
            contentContainerStyle={{ gap: 20 }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F1F5F9",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  datePickerMainContainer: {
    height: "fit-Content",
  },
  appointmentListContainer: {
    flex: 1,
  },
  appointmentContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    padding: 5,
    flex: 1,
  },
  datePickerContainer: {},
  dateButton: {
    padding: 10,
    margin: 5,
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "rgba(9, 14, 29, 0.05)",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 10,
    minHeight: "80px",
    minWidth: "60px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#796AAA",
  },
  dayText: {
    fontSize: 14,
    color: "#796AAA",
  },
  appointmentCard: {
    flexDirection: "column",
    gap: 10,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgb(255, 255, 255)",
    shadowColor: "rgba(16, 24, 40, 0.05)",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 5,
  },
  textContainer: {
    color: "rgb(121, 106, 170)",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontSize: 16,
    fontWeight: "700",
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#796AAA",
  },
  topContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  heading: {
    color: "rgb(121, 106, 170)",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
    letterSpacing: -0.008 * 20,
    textAlign: "left",
  },
});

export default AppointmentScreen;

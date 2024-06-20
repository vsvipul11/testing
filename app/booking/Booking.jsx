import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import {
  GET_TIME_SLOT,
  OAuthSignature,
  ConsumerKey,
  AccessToken,
} from "../../API/ApiHandler";
import demoImg from "../../assets/images/doc.png";

const indianTimeZoneOffset = 5.5 * 60 * 60 * 1000; // Indian Timezone offset in milliseconds (IST)

const BookDoctor = () => {
  const { id, name, image } = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const indianDate = new Date(now.getTime() + indianTimeZoneOffset);
    return indianDate.toISOString().split("T")[0];
  });
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getDoctorTimeSlot();
  }, [selectedDate]);

  async function getDoctorTimeSlot() {
    setIsLoading(true);

    const startOfDay = new Date(selectedDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const headers = {
      Authorization: `OAuth oauth_consumer_key="${ConsumerKey}", oauth_token="${AccessToken}", oauth_signature_method="PLAINTEXT", oauth_timestamp="${Math.floor(
        Date.now() / 1000
      )}", oauth_nonce="${Math.random()
        .toString(36)
        .substring(
          2
        )}", oauth_version="1.0", oauth_signature="${OAuthSignature}"`,
    };

    try {
      const response = await axios.get(
        `${GET_TIME_SLOT}?domain=[('doctor_id','=',${id}), ('availability', '=', 'open'), ('start_datetime', '>=', '${startOfDay.toISOString()}'), ('stop_datetime', '<=', '${endOfDay.toISOString()}')]&fields=['start_datetime','stop_datetime','id']`,
        { headers }
      );
      console.log("response is", response.data);
      setTimeSlots(response.data["slot.booking"]);

      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Error fetching time slots:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTimeSlot) {
      router.push({
        pathname: "/checkout/Checkout",
        params: {
          id,
          name,
          image,
          selectedTimeSlot,
        },
      });
    } else {
      alert("Please select a date and a time slot");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Doctor</Text>
        <TouchableOpacity style={styles.settingIcon}>
          <Ionicons name="settings" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        {/* <Image
          source={{ uri: `data:image/png;base64,${image}` }}
          style={styles.doctorImage}
        /> */}
        <Image source={demoImg} style={styles.doctorImage} />
        <View style={styles.doctorDetails}>
          <Text style={styles.doctorName}>{name}</Text>
          <Text style={styles.doctorDesignation}>{id}</Text>
        </View>
      </View>
      <View style={styles.calendarContainer}>
        <Text style={styles.selectDateTitle}>Select Date</Text>
        <Calendar
          onDayPress={(day) => handleDateSelect(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: "#1E64FA" },
          }}
          minDate={
            new Date(Date.now() + indianTimeZoneOffset)
              .toISOString()
              .split("T")[0]
          }
        />
      </View>
      <View style={styles.timeSlotContainer}>
        <Text style={styles.selectTimeSlotTitle}>Select Time Slot</Text>
        {isLoading ? (
          <ActivityIndicator
            style={styles.loadingIndicator}
            size="large"
            color="#1E64FA"
          />
        ) : (
          <Animated.View
            style={[styles.timeSlotOptions, { opacity: fadeAnim }]}
          >
            {timeSlots.map((slot) => (
              <TouchableOpacity
                key={slot.id}
                style={[
                  styles.timeSlot,
                  selectedTimeSlot === slot.id ? styles.selectedTimeSlot : null,
                ]}
                onPress={() => handleTimeSlotSelect(slot.id)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedTimeSlot === slot.id
                      ? styles.selectedTimeSlotText
                      : null,
                  ]}
                >
                  {`${slot.start_datetime.split(" ")[1]} - ${
                    slot.stop_datetime.split(" ")[1]
                  }`}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}
      </View>
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
    backgroundColor: "94A3B8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    width: "100%",
  },
  backIcon: {
    marginRight: "auto",
  },
  settingIcon: {
    marginLeft: "auto",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center", // Center horizontally
    width: width - 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  doctorDetails: {},
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  doctorDesignation: {
    fontSize: 16,
    marginTop: 5,
    color: "#888",
  },
  calendarContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    width: width - 40,
  },
  selectDateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  timeSlotContainer: {
    padding: 5,
    marginTop: 20,
    alignItems: "center",
  },
  selectTimeSlotTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  timeSlotOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center", // Align slots horizontally centered
    width: "100%",
  },
  timeSlot: {
    backgroundColor: "rgb(255, 255, 255)", // Updated from "red" to the new background color
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 9, // Updated border radius value
    margin: 5,
    boxShadow: "0px 8px 16px 0px rgba(47, 60, 51, 0.05)", // Added box-shadow property
  },
  selectedTimeSlot: {
    borderRadius: 9, // Added border radius
    boxShadow: "0px 8px 16px 0px rgba(47, 60, 51, 0.05)", // Added box shadow
    backgroundColor: "rgb(30, 41, 59)", // Added background color
  },
  timeSlotText: {
    color: "#000",
    fontSize: 16,
  },
  selectedTimeSlotText: {
    color: "white",
  },
  continueButton: {
    backgroundColor: "#1E64FA",
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default BookDoctor;

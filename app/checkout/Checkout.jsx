import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import {
  useFonts,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const Checkout = () => {
  const [promoCode, setPromoCode] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

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

  const [prices, setPrices] = useState({
    consultation: 37,
    admin: 10,
    discount: 10,
    total: 47,
  });

  let [fontsLoaded] = useFonts({
    PlusJakartaSans_700Bold,
  });

  const { id, name, image, selectedTimeSlot } = useLocalSearchParams();
  console.log("id", id, name, selectedTimeSlot);

  const applyCoupon = () => {
    if (promoCode.toLowerCase() === "physio247") {
      setPrices({
        consultation: 0,
        admin: 0,
        discount: 0,
        total: 0,
      });
    }
  };

  if (!fontsLoaded) {
    return null; // You can return a loading indicator here if needed
  }

  const showToast = (message, type = "error", callback) => {
    Toast.show({
      type: type,
      text1: message,
      position: "bottom",
      visibilityTime: 3000,
      autoHide: true,
      onHide: callback, // Execute callback after toast is hidden
    });
  };

  // const checkoutHandler = async () => {
  //   setIsLoading(true);
  //   const data = {
  //     lead_id: userDetails.lead_id,
  //     consultation_type_id: 2,
  //     availability: "booked",
  //     caller_name: userDetails.caller_name,
  //     patient_name: userDetails.patient_name,
  //     payment_mode: "online",
  //   };

  //   try {
  //     const response = await axios.put(
  //       `https://uat-physio-tattva.p7devs.com/book_appointment/${selectedTimeSlot}`,
  //       data,
  //       {
  //         headers: {
  //           Authorization: "Bearer qZpLmkIwXnYeRsTdWuVbHaFcGjDcHbJnKlOuRiQ",
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     console.log("Success:", response.data);
  //     showToast("Booking confirmed", "success");
  //     router.push("/home/Home");
  //   } catch (error) {
  //     console.error("Error:", error.response);
  //     showToast(
  //       error.response.data?.result[0]?.message || "An error occurred",
  //       "error"
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const checkoutHandler = async () => {
    setIsLoading(true);

    const data = {
      lead_id: userDetails.lead_id,
      consultation_type_id: 2,
      availability: "booked",
      caller_name: userDetails.caller_name,
      patient_name: userDetails.patient_name,
      payment_mode: "online",
    };

    try {
      const response = await axios.put(
        `https://uat-physio-tattva.p7devs.com/book_appointment/${selectedTimeSlot}`,
        data,
        {
          headers: {
            Authorization: "Bearer qZpLmkIwXnYeRsTdWuVbHaFcGjDcHbJnKlOuRiQ",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Success:", response.data);

      // Check the status from the result array
      const status = response.data.result[1];
      if (status == 200) {
        showToast("Booking confirmed", "success", () => {
          console.log("navigate");
          router.push("/home/Home");
        });
      } else {
        throw new Error("Failed to book appointment");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast(
        error.response?.data?.result[0]?.message ||
          "Failed to book appointment",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  function handleBack() {
    router.back();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backIcon} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Doctor</Text>
        <TouchableOpacity style={styles.settingIcon}>
          <Ionicons name="settings" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <Image
          source={require("../../assets/images/doc.png")}
          style={styles.doctorImage}
        />
        <View style={styles.doctorDetails}>
          <Text style={styles.doctorName}>{name}</Text>
          <Text style={styles.doctorDesignation}>Physiotherapist</Text>
        </View>
      </View>
      <Text style={styles.promoCodeText}>Promo Code</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Enter promo code"
          value={promoCode}
          onChangeText={setPromoCode}
        />
        <TouchableOpacity style={styles.button} onPress={applyCoupon}>
          <Text style={styles.buttonText}>Use</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.paymentDetails}>
        <Text style={styles.doctorName}>Payment Detail</Text>
        <View style={styles.paymentItemContainer}>
          <Text style={styles.paymentItemText}>
            1x Consultation Package (30min)
          </Text>
          <Text style={styles.paymentItemValue}>${prices.consultation}</Text>
        </View>
        <View style={styles.paymentItemContainer}>
          <Text style={styles.paymentItemText}>Admin fees</Text>
          <Text style={styles.paymentItemValue}>${prices.admin}</Text>
        </View>
        <View style={styles.paymentItemContainer}>
          <Text style={styles.paymentItemText}>Coupon Discount</Text>
          <Text style={styles.paymentItemValue}>${prices.discount}</Text>
        </View>
        <View style={styles.paymentItemContainer}>
          <Text style={styles.grandTotal}>Grand Total</Text>
          <Text style={styles.grandTotalValue}>${prices.total}</Text>
        </View>
      </View>
      <View style={styles.paymentMethod}>
        <Text style={styles.paymentMethodText}>Payment Method</Text>
        <Picker style={styles.picker}>
          <Picker.Item label="MasterCard" value="MasterCard" />
          <Picker.Item label="Visa" value="Visa" />
          {/* Add more payment options if needed */}
        </Picker>
      </View>
      <View style={styles.totalContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.priceContainer}>${prices.total}</Text>
          <Text style={{ color: "white" }}>Total Price</Text>
        </View>
        <View>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={checkoutHandler}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  priceContainer: {
    color: "rgb(255, 255, 255)",
    fontFamily: "Plus Jakarta Sans",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: "32px",
    letterSpacing: "-1%",
    textAlign: "left",
  },
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  doctorDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },

  doctorName: {
    color: "rgb(30, 41, 59)",
    fontFamily: "Plus Jakarta Sans",
    fontSize: "1.2rem",
    fontWeight: "bold", // Updated to 'bold' for consistency
    lineHeight: "24px",
    letterSpacing: "-0.6%",
    textAlign: "left",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backIcon: {
    marginRight: "auto",
  },
  settingIcon: {
    marginLeft: "auto",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    borderRadius: 16,
    boxShadow: "0px 16px 32px 0px rgba(16, 24, 40, 0.05)",
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    display: "flex",
    gap: 20,
  },
  promoCodeText: {
    color: "rgb(30, 41, 59)",
    fontFamily: "Plus Jakarta Sans",
    fontSize: "1rem", // Overridden
    fontWeight: "900", // Extra bold
    lineHeight: "22px", // Overridden
    letterSpacing: "-0.4%", // Overridden
    textAlign: "left", // Overridden
    // Added marginBottom
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  inputField: {
    borderWidth: 1,
    borderColor: "#1E64FA",
    borderRadius: 12,
    padding: 10,
    flex: 8,
    boxSizing: "border-box",
    boxShadow: "0px 0px 0px 4px rgba(15, 103, 254, 0.25)",
    backgroundColor: "rgb(255, 255, 255)",
  },
  button: {
    backgroundColor: "#1E64FA",
    borderRadius: 5,
    padding: 10,
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  paymentDetails: {
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  paymentItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  paymentItemText: {
    fontSize: 16,
  },
  paymentItemValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  grandTotal: {
    fontSize: 16,
    fontWeight: "bold",
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  paymentMethod: {
    marginBottom: 20,
  },
  paymentMethodText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  picker: {
    boxShadow: "0px 8px 16px 0px rgba(47, 60, 51, 0.05)",
    backgroundColor: "rgb(255, 255, 255)",
    height: 40,
  },
  totalContainer: {
    height: "10%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgb(30, 41, 59)",
    borderRadius: 16,
    boxShadow:
      "0px 6px 14px 0px rgba(36, 46, 73, 0.05), 0px 25px 25px 0px rgba(36, 46, 73, 0.04), 0px 57px 34px 0px rgba(36, 46, 73, 0.03), 0px 101px 40px 0px rgba(36, 46, 73, 0.01), 0px 157px 44px 0px rgba(36, 46, 73, 0)",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
  },
  checkoutButton: {
    backgroundColor: "#1E64FA",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  checkoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Checkout;

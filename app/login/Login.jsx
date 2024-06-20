import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import uuid from "react-native-uuid"; // Importing uuid
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const [isFocusedPhoneNumber, setIsFocusedPhoneNumber] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]); // State to store OTP entered by the user
  const [receivedOtpFromApi, setReceivedOtpFromApi] = useState("");
  const otpInputRefs = useRef([]);

  const uid = uuid.v4();

  const handleFocusPhoneNumber = () => {
    setIsFocusedPhoneNumber(true);
  };

  const handleBlurPhoneNumber = () => {
    setIsFocusedPhoneNumber(false);
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus on the next input field if value is entered
    if (value && index < otp.length - 1) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleLogin = async () => {
    try {
      // Make API call to login
      const response = await fetch(
        `https://uat-physio-tattva.p7devs.com/crm_lead/login?phone_number=${phoneNumber}&uid=${uid}&type=login`,
        {
          method: "POST",
          headers: {},
        }
      );

      const data = await response.json();
      // Handle response data
      if (data.success) {
        // Save data in AsyncStorage
        await AsyncStorage.setItem("loginData", JSON.stringify(data));

        // On successful login, send OTP request
        console.log("data", data);
        await sendOtpRequest(phoneNumber);
      } else {
        router.push("/signup/Signup");
        // Display a message and offer the option to create a new account
        // Alert.alert(
        //     'User does not exist',
        //     'Would you like to create a new account?',
        //     [
        //         {
        //             text: 'No',
        //             style: 'cancel',
        //         },
        //         {
        //             text: 'Yes',
        //             onPress: () => router.push('/signup/Signup'),
        //         },
        //     ],
        //     { cancelable: false }
        // );
      }
    } catch (error) {
      // Handle error
      console.error("Error:", error);
    }
  };

  const sendOtpRequest = async (phoneNumber) => {
    try {
      // Make API call to send OTP
      const response = await fetch(
        `https://uat-physio-tattva.p7devs.com/crm_lead/send_otp?phone_number=${phoneNumber}&uid=${uid}`,
        {
          method: "POST",
          headers: {},
        }
      );

      const data = await response.json();
      console.log("s", data);
      // Handle response data
      if (data.success) {
        // Set the received OTP from API
        console.log("data otp", data.OTP);
        setReceivedOtpFromApi(data.OTP);
        setOtpModalVisible(true);
      } else {
      }
    } catch (error) {
      // Handle error
      console.error("Error:", error);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      // Combine the OTP digits into a single string
      const enteredOtp = otp.join("");
      console.log(enteredOtp);
      console.log("output", receivedOtpFromApi.toString());

      // Check if entered OTP matches the OTP received from API
      if (enteredOtp === receivedOtpFromApi.toString()) {
        // If OTP matches, handle successful login
        // Redirect to profile screen
        AsyncStorage.setItem("mobileNumber", phoneNumber);
        router.push("/home/Home");
      } else {
        // If OTP does not match, display error message
        console.log("Invalid OTP. Please try again.");
      }
    } catch (error) {
      // Handle error
      console.error("Error:", error);
    }
  };

  const handleSignup = () => {
    // Navigate to the signup screen

    router.push("/signup/Signup");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/images/plus.png")}
        style={styles.logo}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Sign In To Physio247</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabelText}>Phone Number</Text>
        <TextInput
          style={[styles.input, isFocusedPhoneNumber && styles.inputFocused]}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          autoCapitalize="none"
          onFocus={handleFocusPhoneNumber}
          onBlur={handleBlurPhoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
        />
      </View>
      <TouchableOpacity style={styles.forgotPasswordButton}>
        <Text style={styles.forgotPasswordText}>Forgot Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
        <Text style={styles.signInButtonText}>Sign In</Text>
        <Image
          source={require("../../assets/images/arrow.png")}
          style={styles.arrowIcon}
        />
      </TouchableOpacity>
      {/* Message for users who don't have an account */}
      <TouchableOpacity style={styles.signupButton}>
        <Text style={styles.signupText} onPress={handleSignup}>
          Don't have an account? Sign up
        </Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={otpModalVisible}
        onRequestClose={() => setOtpModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter OTP</Text>
            <View style={styles.otpInputContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (otpInputRefs.current[index] = ref)}
                  style={styles.otpInput}
                  onChangeText={(value) => handleOtpChange(index, value)}
                  value={digit}
                  keyboardType="numeric"
                  maxLength={1}
                />
              ))}
            </View>
            <TouchableOpacity
              style={styles.submitButton1}
              onPress={handleOtpSubmit}
            >
              <Text style={styles.buttonText}>Submit OTP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setOtpModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 90,
  },
  titleText: {
    color: "#796AAA",
    fontSize: 32,
    fontWeight: "bold",
  },
  inputContainer: {
    width: "90%",
    marginBottom: 20,
  },
  inputLabelText: {
    color: "#000000",
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    height: 50,
  },
  inputFocused: {
    borderColor: "#1E64FA",
    shadowColor: "#1E64FA",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  signInButton: {
    backgroundColor: "#097E8B",
    width: "90%",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 12,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: "#FFFFFF",
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginRight: "5%",
  },
  forgotPasswordText: {
    color: "#097E8B",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
  },
  signupButton: {
    alignSelf: "flex-end",
    marginRight: "5%",
  },
  signupText: {
    color: "#097E8B",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#097E8B",
  },
  otpInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  otpInput: {
    height: 40,
    width: "20%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    textAlign: "center",
  },
  verifyButton: {
    width: 140,
    paddingVertical: 15,
    backgroundColor: "#1E64FA",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitButton1: {
    width: 150,
    paddingVertical: 15,
    backgroundColor: "#097E8B",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  closeButton: {
    width: 150,
    paddingVertical: 15,
    backgroundColor: "#FF6347",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Login;

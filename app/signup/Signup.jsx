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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { router } from "expo-router";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isFocusedFirstName, setIsFocusedFirstName] = useState(false);
  const [isFocusedLastName, setIsFocusedLastName] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPhoneNumber, setIsFocusedPhoneNumber] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [phoneNumberModalVisible, setPhoneNumberModalVisible] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [receivedOtpFromApi, setReceivedOtpFromApi] = useState("");
  const otpInputRefs = useRef([]);

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);

  const handleFocusFirstName = () => {
    setIsFocusedFirstName(true);
  };

  const handleBlurFirstName = () => {
    setIsFocusedFirstName(false);
  };

  const handleFocusLastName = () => {
    setIsFocusedLastName(true);
  };

  const handleBlurLastName = () => {
    setIsFocusedLastName(false);
  };

  const handleFocusEmail = () => {
    setIsFocusedEmail(true);
  };

  const handleBlurEmail = () => {
    setIsFocusedEmail(false);
  };

  const handleFocusPhoneNumber = () => {
    setIsFocusedPhoneNumber(true);
  };

  const handleBlurPhoneNumber = () => {
    setIsFocusedPhoneNumber(false);
  };

  const handleSignup = () => {
    if (!firstName || !lastName || !email || !phoneNumber) {
      if (!firstName) setFirstNameError(true);
      if (!lastName) setLastNameError(true);
      if (!email) setEmailError(true);
      if (!phoneNumber) setPhoneNumberError(true);
    }
    setPhoneNumberModalVisible(true);
  };

  const handleVerifyPhoneNumber = async () => {
    try {
      const response = await axios.post(
        `https://uat-physio-tattva.p7devs.com/crm_lead/login?phone_number=${phoneNumber}&uid=87968657543asvfdf&type=signup`
      );
      const { OTP, uid } = response.data;
      console.log("OTP:", OTP);
      console.log("UID:", uid);
      setReceivedOtpFromApi(OTP);
      setPhoneNumberModalVisible(false);
      setOtpModalVisible(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpSubmit = () => {
    if (otp.join("") === receivedOtpFromApi) {
      axios
        .post("https://uat-physio-tattva.p7devs.com/mobile/signup", {
          f_name: firstName,
          l_name: lastName,
          email: email,
          mobile: phoneNumber,
        })
        .then((response) => {
          router.push("/home/Home");

          console.log("Signup response:", response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      console.log("OTP verification failed");
    }
  };

  const handleCloseModal = () => {
    setPhoneNumberModalVisible(false);
    setOtpModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/images/plus.png")}
        style={styles.logo}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Sign Up For Free</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabelText}>First Name</Text>
        <TextInput
          style={[
            styles.input,
            isFocusedFirstName && styles.inputFocused,
            firstNameError && styles.inputError,
          ]}
          placeholder="Enter your first name"
          autoCapitalize="none"
          onFocus={handleFocusFirstName}
          onBlur={handleBlurFirstName}
          onChangeText={(text) => {
            setFirstName(text);
            setFirstNameError(false);
          }}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabelText}>Last Name</Text>
        <TextInput
          style={[
            styles.input,
            isFocusedLastName && styles.inputFocused,
            lastNameError && styles.inputError,
          ]}
          placeholder="Enter your last name"
          autoCapitalize="none"
          onFocus={handleFocusLastName}
          onBlur={handleBlurLastName}
          onChangeText={(text) => {
            setLastName(text);
            setLastNameError(false);
          }}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabelText}>Email Address</Text>
        <TextInput
          style={[
            styles.input,
            isFocusedEmail && styles.inputFocused,
            emailError && styles.inputError,
          ]}
          placeholder="Enter your email address"
          keyboardType="email-address"
          autoCapitalize="none"
          onFocus={handleFocusEmail}
          onBlur={handleBlurEmail}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError(false);
          }}
        />
      </View>
      <TouchableOpacity style={styles.signInButton} onPress={handleSignup}>
        <Text style={styles.signInButtonText}>Sign Up</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={phoneNumberModalVisible}
        onRequestClose={() => setPhoneNumberModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter Phone Number</Text>
            <TextInput
              style={styles.input3}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              autoCapitalize="none"
              onChangeText={setPhoneNumber}
              maxLength={10}
            />
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handleVerifyPhoneNumber}
            >
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
              style={styles.cancelButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <AlreadyHaveAccountText />
    </SafeAreaView>
  );
};

const AlreadyHaveAccountText = () => {
  return (
    <TouchableOpacity onPress={() => router.push("login/Login")}>
      <Text style={styles.loginText}>Already have an account? Login</Text>
    </TouchableOpacity>
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
  input3: {
    width: 200,
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
  inputError: {
    borderColor: "red",
  },
  signInButton: {
    backgroundColor: "#097E8B",
    width: "90%",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
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
    backgroundColor: "#1E64FA",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  cancelButton: {
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
  loginText: {
    color: "#097E8B",
    marginTop: 20,
    fontWeight: "bold",
  },
});

export default Signup;

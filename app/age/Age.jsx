import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
  Linking,
  Alert,
  Platform,
} from "react-native";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router"; // Assuming 'router' is exported from 'expo-router'
import Options from "../../components/options";

const options = [
  { label: "Skip Question", value: "skip" },
  { label: "Book Call", value: "book_call" },
  { label: "Back", value: "back" },
  { label: "End Session", value: "end", disabled: true },
];

const Age = ({ navigation }) => {
  const { height, weight } = useLocalSearchParams();
  const [firstDigit, setFirstDigit] = useState("");
  const [secondDigit, setSecondDigit] = useState("");
  const [loading, setLoading] = useState(false);
  const secondInputRef = useRef(null);
  const tuneApiUrl = "https://proxy.tune.app/chat/completions";
  const apiKey = "sk-tune-boN2wTYE0oHtXOjNga39uhD95OlO2cKGXH7";

  const [showOptions, setShowOptions] = useState(false); // State to manage options visibility
  const rotationValue = useRef(new Animated.Value(0)).current; // Animated value for rotation

  useEffect(() => {
    if (Platform.OS === "web") {
      const handleKeyDown = (event) => {
        if (event.key === "Enter") {
          handleClick();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [firstDigit, secondDigit]);

  const handleSelect = (option) => {
    switch (option.value) {
      case "skip":
        handleClick();
        break;
      case "book_call":
        handleBookCall();
        break;
      case "back":
        handleBack();
        break;
      case "end":
        handleEndSession();
        break;
      default:
        break;
    }
  };

  const handleBookCall = async () => {
    Linking.openURL("https://cal.com/kushal-raju/30min");
    handleMenu();
  };

  function handleBack() {
    setShowOptions(false);
    router.back();
  }

  function handleMenu() {
    setShowOptions((prev) => !prev); // Toggle options visibility
  }

  const rotateInterpolate = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const rotateStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  const rotateImage = () => {
    Animated.timing(rotationValue, {
      toValue: 0.2,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      rotationValue.setValue(0); // Reset rotation value after animation completes
    });
  };

  const handleFirstDigitChange = (text) => {
    if (text.length > 0) {
      setFirstDigit(text);
      secondInputRef.current.focus();
    } else {
      setFirstDigit("");
    }
  };

  const handleSecondDigitChange = (text) => {
    if (text.length > 0) {
      setSecondDigit(text);
    } else {
      setSecondDigit("");
    }
  };

  const handleClick = async () => {
    if (secondDigit === "") {
      Alert.alert("Error", "Please enter your age.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetchTuneAiResponse([]);
      console.log("Response:", response);

      // Navigate to the next screen with parameters
      router.push({
        pathname: "/chat/Chat",
        params: {
          responseData: response,
          age: `${firstDigit}${secondDigit}`,
          weight: weight,
          height: height,
        },
      });
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTuneAiResponse = async (userMessages) => {
    const systemMessage = {
      role: "system",
      content:
        "# Role:\nYou are an exceptional physiotherapist. You possess in-depth knowledge and skills in physiotherapy.\n\n# Objective:\nYour main objective is to act as a symptom checker. Conduct a detailed assessment of the user's pain, thoroughly explore the history and characteristics of their symptoms, and determine a provisional diagnosis. Recommend physical assessments where necessary.\n\n# Rules:\n1. Ask a series of detailed questions to gather comprehensive information. You should not exceed one question at a time, but continue the questioning until all necessary details are collected.\n2. Ensure that questions cover all necessary aspects such as the onset of symptoms, their duration, severity, exact location, factors that exacerbate or alleviate the symptoms, and any associated symptoms.\n3. Collect additional relevant information including height, age, weight, and specific symptoms.\n4. Do not conclude the assessment until a full understanding of the user's condition is achieved based on the gathered information.\n\n# Note:\nAny files mentioned are for your knowledge and are uploaded by the assistant creator, not the user.\n\n# Conclusion:\nOnce you have comprehensively gathered all relevant information and feel confident in the provisional diagnosis, guide the user to book a video consultation with us for a detailed evaluation and personalized treatment plan. Use this link for booking: https://cal.com/kushal-raju/15min. Also write a precise assessment sheet at the end.\n\n# Consistency:\nMaintain a consistent approach in how you interact with different users, ensuring that each user receives the same level of care and detailed questioning. Ensure that no initial assessment is concluded prematurely.",
    };

    try {
      const messages = [systemMessage, ...userMessages];
      const response = await axios.post(
        tuneApiUrl,
        {
          temperature: 0.8,
          messages: messages,
          model: "rohan/tune-gpt-4o",
          stream: false,
          frequency_penalty: 0,
          max_tokens: 900,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: apiKey,
          },
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("Error fetching AI response:", error);
      throw error;
    }
  };

  const displayText =
    firstDigit !== "" && secondDigit !== ""
      ? `I am ${firstDigit}${secondDigit} years old`
      : "";

  return (
    <View style={styles.container}>
      <View style={styles.flexCol20px}>
        <Image
          source={require("../../assets/images/plusgreen.png")}
          style={styles.image}
        />
        <Text style={styles.greetingText}>
          What’s your current age? Determining your age is very useful for the
          result.
        </Text>
      </View>
      <View style={styles.flexCol20px}>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              alignItems: "flex-end",
            }}
          >
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              maxLength={1}
              value={firstDigit}
              onChangeText={handleFirstDigitChange}
            />
            <TextInput
              ref={secondInputRef}
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              maxLength={1}
              value={secondDigit}
              onChangeText={handleSecondDigitChange}
              onSubmitEditing={handleClick} // Handle submission on Enter press
            />
          </View>
          {displayText !== "" && (
            <Text style={styles.ageText}>{displayText}</Text>
          )}
        </View>
        <View
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            {showOptions && (
              <View
                style={{
                  position: "absolute",
                  zIndex: "88",
                  minWidth: "200px",
                  bottom: "5rem",
                }}
              >
                <Options options={options} onSelect={handleSelect} />
              </View>
            )}
            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={[styles.button2, styles.menuBtn]}
                onPress={() => {
                  handleMenu();
                  rotateImage(); // Rotate image on button click
                }}
              >
                <Animated.Image
                  source={require("../../assets/images/menu.png")}
                  style={[styles.image2, rotateStyle]} // Apply rotation style
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={[styles.button, styles.blueButton]}
              onPress={handleClick}
              disabled={displayText === "" || loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Continue</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "rgb(241, 245, 249)",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  menuContainer: {
    height: "auto",
    borderRadius: 10,
    shadowColor: "rgba(16, 24, 40, 0.05)",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 32,
    backgroundColor: "rgb(255, 255, 255)",
  },
  button2: {
    maxWidth: "fit-content",
    height: "100%",
    padding: 20,
    justifyContent: "center",
  },
  image: {
    width: 80,
    height: 80,
  },
  flexCol20px: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  greetingText: {
    fontSize: 24,
    color: "rgb(121, 106, 170)",
    fontWeight: "500",
  },
  input: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    textAlign: "center",
    marginRight: 10,
    fontSize: 14,
    fontWeight: "800",
  },
  button: {
    borderRadius: 10,
    padding: 20,
  },
  blueButton: {
    backgroundColor: "#097E8B",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  ageText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Age;

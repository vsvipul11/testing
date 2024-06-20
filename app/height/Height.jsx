import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Easing,
  Animated,
  Linking,
  Alert,
} from "react-native";
import axios from "axios";
import { router } from "expo-router"; // Adjusted import assuming 'router' is directly imported
import Options from "../../components/options";

const options = [
  { label: "Skip Question", value: "skip" },
  { label: "Book Call", value: "book_call" },
  { label: "Back", value: "back" },
  { label: "End Session", value: "end", disabled: true },
];

const Height = ({ navigation }) => {
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [loading, setLoading] = useState(false);
  const inchesInputRef = useRef(null);
  const rotationValue = useRef(new Animated.Value(0)).current; // Animated value for rotation
  const [showOptions, setShowOptions] = useState(false); // State to manage options visibility

  const tuneApiUrl = "https://proxy.tune.app/chat/completions";
  const apiKey = "sk-tune-boN2wTYE0oHtXOjNga39uhD95OlO2cKGXH7";

  const handleSelect = (option) => {
    switch (option.value) {
      case "skip":
        handleSkip();
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

  const handleSkip = () => {
    setLoading(true);
    try {
      router.push({
        pathname: "/weight/Weight",
      });
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowOptions(false);
    router.back();
  };

  const handleMenu = () => {
    setShowOptions((prev) => !prev); // Toggle options visibility
  };

  const rotateInterpolate = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const rotateStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  const handleFeetChange = (text) => {
    if (text.length > 0) {
      setFeet(text);
      inchesInputRef.current.focus();
    } else {
      setFeet("");
    }
  };

  const handleInchesChange = (text) => {
    if (text.length > 0) {
      setInches(text);
    } else {
      setInches("");
    }
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

  const handleClick = async () => {
    if (feet === "" || inches === "") {
      Alert.alert("Error", "Please enter both feet and inches.");
      return;
    }

    setLoading(true);
    try {
      const heightInFeetAndInches = `${feet} feet ${inches} inches`;
      const response = await fetchTuneAiResponse([]);
      router.push({
        pathname: "/weight/Weight",
        params: {
          responseData: response,
          height: heightInFeetAndInches,
        },
      });
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTuneAiResponse = async (userMessages) => {
    // Function to fetch AI response
  };

  const displayText =
    feet !== "" && inches !== ""
      ? `My height is ${feet} feet ${inches} inches`
      : "";

  return (
    <View style={styles.container}>
      <View style={styles.flexCol20px}>
        <Image
          source={require("../../assets/images/plusgreen.png")}
          style={styles.image}
        />
        <Text style={styles.greetingText}>
          What’s your current Height? Please provide your height in feet and
          inches.
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
              gap: 10,
              alignItems: "flex-end",
            }}
          >
            <TextInput
              style={styles.input}
              placeholder="Feet"
              keyboardType="numeric"
              maxLength={2}
              value={feet}
              onChangeText={handleFeetChange}
            />
            <TextInput
              ref={inchesInputRef}
              style={styles.input}
              placeholder="Inches"
              keyboardType="numeric"
              maxLength={2}
              value={inches}
              onChangeText={handleInchesChange}
              onSubmitEditing={handleClick} // Handle Enter key press
            />
          </View>
          {displayText !== "" && (
            <Text style={styles.heightText}>{displayText}</Text>
          )}
        </View>
        <View
          style={{
            padding: 10,
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
                  zIndex: 88,
                  minWidth: 200,
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
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "rgb(241, 245, 249)",
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
    fontWeight: "500",
    color: "rgb(121, 106, 170)",
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
  heightText: {
    fontSize: 18,
    fontWeight: "bold",
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
});

export default Height;

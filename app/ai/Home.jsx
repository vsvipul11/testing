import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Easing,
  Linking,
  Keyboard,
  Platform,
} from "react-native";
import { Link, router } from "expo-router";
import Options from "../../components/options";
import AsyncStorage from "@react-native-async-storage/async-storage";

const options = [
  { label: "Skip Question", value: "skip", disabled: true },
  { label: "Book Call", value: "book_call" },
  { label: "Back", value: "back" },
  { label: "End Session", value: "end", disabled: true },
];

const Home = ({ navigation }) => {
  const [showOptions, setShowOptions] = useState(false); // State to manage options visibility
  const rotationValue = useRef(new Animated.Value(0)).current; // Animated value for rotation

  const [userDetails, setUserDetails] = useState({});

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
    const handleKeyPress = (event) => {
      if (event.key === "Enter" || event.keyCode === 13) {
        handleClick();
      }
    };

    if (Platform.OS === "web") {
      // Add event listener for Enter key press in web environment
      window.addEventListener("keydown", handleKeyPress);
    } else {
      // Add event listener for Enter key press in native environment
      Keyboard.addListener("keyboardDidShow", handleKeyPress);
    }

    // Clean up event listener
    return () => {
      if (Platform.OS === "web") {
        window.removeEventListener("keydown", handleKeyPress);
      } else {
        Keyboard.removeListener("keyboardDidShow", handleKeyPress);
      }
    };
  }, []);

  const handleBookCall = async () => {
    Linking.openURL("https://cal.com/kushal-raju/30min");
    handleMenu();
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

  const handleClick = () => {
    router.push("/height/Height");
  };

  const handleBack = () => {
    router.push("/loading/Loading");
  };

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

  return (
    <View style={styles.container}>
      {/* Image on top left */}
      <Image
        source={require("../../assets/images/plusgreen.png")}
        style={styles.image}
      />

      {/* Text section */}
      <View style={styles.textContainer}>
        <Text style={styles.greetingText}>
          Hey, {userDetails?.caller_name || "User"}! I’m Dr. Akash AI, and I’ll
          guide you to analyze your possible symptom. Are You Ready?
        </Text>
      </View>

      {/* Buttons */}

      <View style={styles.buttonContainer}>
        {showOptions && (
          <View style={{ position: "absolute", marginBottom: "18em" }}>
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
        {/* Red button */}
        <View style={{ alignItems: "flex-end" }}>
          <TouchableOpacity
            style={[styles.button, styles.redButton]}
            onPress={handleBack}
          >
            <Text style={styles.buttonText}>No, go back</Text>
          </TouchableOpacity>

          {/* Blue button */}
          <TouchableOpacity
            style={[styles.button, styles.blueButton]}
            onPress={handleClick}
          >
            <Text style={styles.buttonText}>Yes, start</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    // borderWidth: 1,
    height: "auto", // 'auto' is the closest equivalent to 'fit-content' in React Native
    borderRadius: 10,
    shadowColor: "rgba(16, 24, 40, 0.05)",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 32,
    backgroundColor: "rgb(255, 255, 255)",
  },

  container: {
    flex: 1,
    backgroundColor: "rgb(241, 245, 249)", // Setting the background color
    justifyContent: "flex-start",
    alignItems: "flex-start", // Correct property for left alignment in React Native
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 20,
    marginTop: 50,
  },

  image2: {
    width: 30,
    height: 30,
  },

  textContainer: {
    alignItems: "left",
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "500",
    marginBottom: 10,
    padding: 20,
    color: "#796AAA",
  },
  descriptionText: {
    fontSize: 16,
    textAlign: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    // right: 20,
    // borderWidth: "1px",
  },
  button: {
    borderRadius: 10,
    maxWidth: "fit-content",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  button2: {
    maxWidth: "fit-content",
    height: "100%",
    padding: "20px",
    // alignItems: "center",
    justifyContent: "center",
  },
  menuBtn: {
    // backgroundColor: "white",
    // backgroundColor: "blue",
    // borderWidth: "1px solid black",
  },
  redButton: {
    backgroundColor: "#69308A",
    // padding: "20px",
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

export default Home;

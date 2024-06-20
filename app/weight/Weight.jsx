import React, { useState, useRef, useEffect } from "react";
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
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Options from "../../components/options";

const options = [
  { label: "Skip Question", value: "skip" },
  { label: "Book Call", value: "book_call" },
  { label: "Back", value: "back" },
  { label: "End Session", value: "end", disabled: true },
];

const Weight = () => {
  const { height } = useLocalSearchParams();
  const [firstDigit, setFirstDigit] = useState(""); // No default value for the first digit
  const [secondDigit, setSecondDigit] = useState("");
  const [thirdDigit, setThirdDigit] = useState("");
  const [loading, setLoading] = useState(false);
  const firstInputRef = useRef(null);
  const secondInputRef = useRef(null);
  const thirdInputRef = useRef(null);

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
  }, [firstDigit, secondDigit, thirdDigit]);

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
    setFirstDigit(text);
    if (text.length === 1) {
      secondInputRef.current.focus();
    }
  };

  const handleSecondDigitChange = (text) => {
    setSecondDigit(text);
    if (text.length === 1) {
      thirdInputRef.current.focus();
    }
  };

  const handleThirdDigitChange = (text) => {
    setThirdDigit(text);
    if (firstDigit === "") {
      setFirstDigit("0");
    }
  };

  const handleClick = async () => {
    if (secondDigit == "" || thirdDigit == "") {
      Alert.alert("Error", "Weight cannot be empty");
      return;
    }
    setLoading(true);
    const weightInKg = `${firstDigit}${secondDigit}${thirdDigit}`;
    const param = {};
    if (height) {
      param["height"] = height;
    }
    if (weightInKg) {
      param["weight"] = weightInKg;
    }
    router.push({
      pathname: "/age/Age",
      params: param,
    });
  };

  const displayText =
    firstDigit !== "" && secondDigit !== "" && thirdDigit !== ""
      ? `My weight is ${firstDigit}${secondDigit}${thirdDigit} kg`
      : "";

  return (
    <View style={styles.container}>
      <View style={styles.flexCol20px}>
        <Image
          source={require("../../assets/images/plusgreen.png")}
          style={styles.image}
        />
        <Text style={styles.greetingText}>
          What’s your current Weight? Determining your weight is very useful for
          the result.
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
              ref={firstInputRef}
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              maxLength={1}
              value={firstDigit}
              onChangeText={handleFirstDigitChange}
              onSubmitEditing={() => secondInputRef.current.focus()}
            />
            <TextInput
              ref={secondInputRef}
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              maxLength={1}
              value={secondDigit}
              onChangeText={handleSecondDigitChange}
              onSubmitEditing={() => thirdInputRef.current.focus()}
            />
            <TextInput
              ref={thirdInputRef}
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              maxLength={1}
              value={thirdDigit}
              onChangeText={handleThirdDigitChange}
              onSubmitEditing={handleClick}
            />
          </View>
          {displayText !== "" && (
            <Text style={styles.weightText}>{displayText}</Text>
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
    padding: "10px",
    backgroundColor: "rgb(241, 245, 249)",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  menuContainer: {
    height: "auto", // 'auto' is the closest equivalent to 'fit-content' in React Native
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
    padding: "20px",
    justifyContent: "center",
  },

  image: {
    width: 80,
    height: 80,
  },

  flexCol20px: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  textContainer: {
    alignItems: "flex-start",
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "500",
    color: "rgb(121, 106, 170)",
  },
  inputContainer: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    bottom: "10px",
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
    padding: "20px",
  },
  blueButton: {
    backgroundColor: "#097E8B",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  weightText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Weight;

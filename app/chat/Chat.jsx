import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Linking,
  Animated,
  Easing,
} from "react-native";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router"; // Import useLocalSearchParams from expo-router
import { saveChat } from "../../API/ApiHandler";
// import axios from "axios";
import Options from "../../components/options";
import AsyncStorage from "@react-native-async-storage/async-storage";

const options = [
  { label: "Skip Question", value: "skip" },
  { label: "Book Call", value: "book_call" },
  { label: "Back", value: "back", disabled: true },
  { label: "End Session", value: "end" },
];

const Chat = ({ navigation }) => {
  // Access the response data from the router store
  const { responseData, age, weight, height } = useLocalSearchParams();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [latestResponse, setLatestResponse] = useState("");
  const [loading, setLoading] = useState(false); // State variable to track loading
  const [finishVisible, setFinishVisible] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);

  console.log("message", messages);

  const [showOptions, setShowOptions] = useState(false); // State to manage options visibility
  const rotationValue = useRef(new Animated.Value(0)).current; // Animated value for rotation

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
  async function handleEndSession() {
    if (sessionEnded) {
      return;
    }
    setSessionEnded(true);
    setShowOptions(false);
    setLoading(true);
    const mobileNumber = await AsyncStorage.getItem("mobileNumber");
    const chatData = {
      userId: mobileNumber,
      chat: {
        messages: messages,
      },
    };

    try {
      await axios.post(saveChat, chatData).then((response) => {
        console.log(response, "chat stored");
        router.replace("/home/Home");
      });
    } catch (error) {
      console.log("ERROR while saving chat", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSkip() {
    setShowOptions(false);
    const skipMsg =
      "i want to skip this question please continue with further analysis";
    const userMessage = { role: "user", content: skipMsg };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    // setInputValue("");
    setLoading(true); // Set loading state to true

    try {
      // Call the API function to fetch response
      const response = await fetchTuneAiResponse(newMessages);
      // Update the messages with the assistant's response
      const assistantMessage = {
        role: "assistant",
        content: response.choices[0].message.content,
      };
      setMessages([...newMessages, assistantMessage]);
      const cleanedContent = assistantMessage.content.replace(/[*#]/g, ""); // Remove asterisks and hashtags from the message content
      setLatestResponse(cleanedContent);

      const assessmentCompleted = assistantMessage.content.includes(
        "https://cal.com/kushal-raju/30min"
      );
      if (assessmentCompleted) {
        setFinishVisible(true); // Make the "Finish" button visible
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      setLoading(false); // Set loading state to false once data is fetched
    }
  }
  const handleBookCall = async () => {
    Linking.openURL("https://cal.com/kushal-raju/30min");
    handleMenu();
  };

  //   function handleSkip() {}
  function handleBack() {
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

  const systemMessage = {
    role: "system",
    content: `# Role:\nYou are an exceptional physiotherapist. You possess in-depth knowledge and skills in physiotherapy.\n\n# Objective:\nYour main objective is to act as a symptom checker. Conduct a detailed assessment of the user's pain, thoroughly explore the history and characteristics of their symptoms, and determine a provisional diagnosis. Recommend physical assessments where necessary.\n\n# Rules:\n1. Ask a series of detailed questions to gather comprehensive information. You should not exceed one questions at a time, but continue the questioning until all necessary details are collected.\n2. Ensure that questions cover all necessary aspects such as the onset of symptoms, their duration, severity, exact location, factors that exacerbate or alleviate the symptoms, and any associated symptoms.\n3. Collect additional relevant information including height, age, weight, and specific symptoms.\n4. Do not conclude the assessment until a full understanding of the user's condition is achieved based on the gathered information.\n\n# Note:\nAny files mentioned are for your knowledge and are uploaded by the assistant creator, not the user.\n\n# Conclusion:\nOnce you have comprehensively gathered all relevant information and feel confident in the provisional diagnosis, guide the user to book a video consultation with us for a detailed evaluation and personalized treatment plan. Use this link for booking: https://cal.com/kushal-raju/30min. Also write a precise assessment sheet at the end. \n\n# Consistency:\nMaintain a consistent approach in how you interact with different users, ensuring that each user receives the same level of care and detailed questioning. Ensure that no initial assessment is concluded prematurely. The age of the user is ${age}, The weight of the user is ${weight}, the height of the user is ${height}`,
  };

  useEffect(() => {
    // Initialize the chat with the system message
    const initialAssistantMessage = {
      role: "assistant",
      content:
        "Hello! I'm here to help you assess your pain and symptoms. To start, could you please describe the main issue or pain you are experiencing right now? Include details such as the specific location and any sensations you feel.",
    };
    setMessages([systemMessage, initialAssistantMessage]);
    setLatestResponse(initialAssistantMessage.content);
  }, []);

  const handleFinish = async () => {
    Linking.openURL("https://cal.com/kushal-raju/30min");
  };

  // Function to handle continue button click
  const handleClick = async () => {
    if (inputValue.trim() === "") return;

    const userMessage = { role: "user", content: inputValue.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setLoading(true); // Set loading state to true

    try {
      // Call the API function to fetch response
      const response = await fetchTuneAiResponse(newMessages);
      // Update the messages with the assistant's response
      const assistantMessage = {
        role: "assistant",
        content: response.choices[0].message.content,
      };
      setMessages([...newMessages, assistantMessage]);
      const cleanedContent = assistantMessage.content.replace(/[*#]/g, ""); // Remove asterisks and hashtags from the message content
      setLatestResponse(cleanedContent);

      const assessmentCompleted = assistantMessage.content.includes(
        "https://cal.com/kushal-raju/30min"
      );
      if (assessmentCompleted) {
        setFinishVisible(true); // Make the "Finish" button visible
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      setLoading(false); // Set loading state to false once data is fetched
    }
  };

  // Function to handle input change
  const handleInputChange = (text) => {
    setInputValue(text);
  };

  // Function to fetch response from Tune AI API
  const fetchTuneAiResponse = async (messages) => {
    const tuneApiUrl = "https://proxy.tune.app/chat/completions";
    const apiKey = "sk-tune-boN2wTYE0oHtXOjNga39uhD95OlO2cKGXH7";

    try {
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
      return response.data;
    } catch (error) {
      console.error("Error fetching AI response:", error);
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      {/* Image on top left */}
      <Image
        source={require("../../assets/images/plusgreen.png")}
        style={styles.image}
      />

      {/* Text section */}
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.textContainer}>
          {loading ? ( // Render skeleton loader if loading state is true
            <SkeletonLoader />
          ) : (
            <Text style={styles.greetingText}>
              {latestResponse || responseData}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Input field */}
      <View style={styles.inputContainer}>
        <ScrollView>
          <TextInput
            style={styles.input}
            placeholder="Enter your description...."
            value={inputValue}
            multiline={true}
            numberOfLines={5}
            onChangeText={handleInputChange}
          />
          {/* Continue button */}
        </ScrollView>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <View>
            {showOptions && (
              <View
                style={{
                  position: "absolute",
                  zIndex: "88",
                  minWidth: "200px",
                  bottom: "4rem",
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
          <View>
            {!finishVisible && (
              <TouchableOpacity
                style={[styles.button, styles.blueButton]}
                onPress={handleClick}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Continue</Text>
                )}
              </TouchableOpacity>
            )}

            {/* Finish button */}
            {finishVisible && (
              <TouchableOpacity
                style={[styles.button, styles.blueButton]}
                onPress={handleFinish}
              >
                <Text style={styles.buttonText}>Book a call</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

// Skeleton loader component
const SkeletonLoader = () => (
  <View style={styles.skeletonContainer}>
    <View style={styles.skeletonText} />
    <View style={styles.skeletonText} />
    <View style={styles.skeletonText} />
    <View style={styles.skeletonText} />
    <View style={styles.skeletonText} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(241, 245, 249);",
  },
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
  button2: {
    maxWidth: "fit-content",
    height: "100%",
    padding: "20px",
    // alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: 80,
    height: 80,
    marginBottom: 20,
    marginTop: 30,
  },
  textContainer: {
    alignItems: "flex-start",
    height: 600,
    padding: "10px",
  },
  greetingText: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: 10,
    color: "rgb(121, 106, 170)",
    paddingHorizontal: 20,
  },
  inputContainer: {},
  input: {
    width: "100%",
    height: 80,
    // borderWidth: 1,
    // borderColor: "white",
    borderRadius: 10,
    backgroundColor: "rgb(241, 245, 249);",
    // backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    padding: "10px",
    fontSize: 16,
    marginBottom: 2,
    marginLeft: 20,
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
  // Skeleton loader styles
  skeletonContainer: {
    paddingHorizontal: 20,
  },
  skeletonText: {
    backgroundColor: "pink",
    height: 20,
    width: "100%",
    borderRadius: 5,
    marginBottom: 5,
  },
});

export default Chat;

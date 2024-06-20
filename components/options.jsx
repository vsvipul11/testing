import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const Options = ({
  options,
  onSelect,
  containerStyle = {},
  textStyle = {},
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hoveredOption, setHoveredOption] = useState(null);

  const handleSelect = (option) => {
    setSelectedOption(option.value);
    if (onSelect) {
      onSelect(option);
    }
  };

  const handleHover = (option) => {
    setHoveredOption(option.value);
  };

  const handleUnhover = () => {
    setHoveredOption(null);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <FlatList
        data={options}
        keyExtractor={(item, index) => item.value.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => !item.disabled && handleSelect(item)}
            onPressIn={() => handleHover(item)}
            onPressOut={handleUnhover}
            style={[
              styles.option,
              selectedOption === item.value && styles.selectedOption,
              (hoveredOption === item.value || selectedOption === item.value) &&
                styles.hoveredOption,
              item.disabled && styles.disabledOption,
            ]}
            activeOpacity={0.7} // Adjust the opacity when pressing
          >
            <Text
              style={[
                styles.optionText,
                textStyle,
                selectedOption === item.value && styles.selectedOptionText,
                (hoveredOption === item.value ||
                  selectedOption === item.value) &&
                  styles.hoveredOptionText,
                item.disabled && styles.disabledOptionText,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    backgroundColor: "rgb(255, 255, 255)",
    padding: 15,
    shadowColor: "rgba(16, 24, 40, 0.05)",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 32,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomColor: "#ddd",
    cursor: "pointer", // Default cursor
  },
  selectedOption: {
    backgroundColor: "rgb(239, 246, 255)",
  },
  hoveredOption: {
    backgroundColor: "rgb(239, 246, 255)",
  },
  disabledOption: {
    backgroundColor: "#eee",
    cursor: "not-allowed", // Cursor for disabled option
  },
  optionText: {
    fontSize: 16,
    color: "rgb(121, 106, 170)",
  },
  selectedOptionText: {
    color: "rgb(9, 126, 139)",
  },
  hoveredOptionText: {
    color: "rgb(9, 126, 139)",
  },
  disabledOptionText: {
    color: "#999",
  },
});

export default Options;

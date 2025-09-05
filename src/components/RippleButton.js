import React, { useRef } from "react";
import { Pressable, Animated, StyleSheet, View } from "react-native";

const RippleButton = ({ children, onPress, style }) => {
  const ripple = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    ripple.setValue(0);
    Animated.timing(ripple, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      style={[styles.button, style]}
    >
      <View style={styles.content}>{children}</View>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.ripple,
          {
            opacity: ripple.interpolate({
              inputRange: [0, 1],
              outputRange: [0.18, 0],
            }),
            transform: [
              {
                scale: ripple.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 3],
                }),
              },
            ],
          },
        ]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    overflow: "hidden",
    borderRadius: 28,
    backgroundColor: "#75857a", // Pebble green
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    minWidth: 120,
  },
  content: {
    zIndex: 2,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  ripple: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#b6c3ba", // Lighter green
    borderRadius: 999,
    zIndex: 1,
  },
});

export default RippleButton;
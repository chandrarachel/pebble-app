import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Ripple from 'react-native-material-ripple';

const PebbleButton = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  style 
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    if (disabled) {
      baseStyle.push(styles.disabled);
    } else {
      baseStyle.push(styles[variant]);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`${size}Text`]];
    
    if (disabled) {
      baseStyle.push(styles.disabledText);
    } else {
      baseStyle.push(styles[`${variant}Text`]);
    }
    
    return baseStyle;
  };

  const getRippleColor = () => {
    if (disabled) return 'transparent';
    switch (variant) {
      case 'primary': return '#F2F7F5';
      case 'secondary': return '#232D3F';
      case 'accent': return '#232D3F';
      case 'outline': return '#5C8374';
      default: return '#F2F7F5';
    }
  };

  return (
    <Ripple
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
      rippleColor={getRippleColor()}
      rippleOpacity={0.3}
      rippleContainerBorderRadius={25}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </Ripple>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  // Variants
  primary: {
    backgroundColor: '#5C8374',
  },
  secondary: {
    backgroundColor: '#6EC6CA',
  },
  accent: {
    backgroundColor: '#FFD166',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#5C8374',
  },
  
  // Sizes
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 56,
  },
  
  // Disabled
  disabled: {
    backgroundColor: '#E0E0E0',
    shadowOpacity: 0,
    elevation: 0,
  },
  
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Text variants
  primaryText: {
    color: '#F2F7F5',
  },
  secondaryText: {
    color: '#232D3F',
  },
  accentText: {
    color: '#232D3F',
  },
  outlineText: {
    color: '#5C8374',
  },
  
  // Text sizes
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  
  // Disabled text
  disabledText: {
    color: '#999',
  },
});

export default PebbleButton;
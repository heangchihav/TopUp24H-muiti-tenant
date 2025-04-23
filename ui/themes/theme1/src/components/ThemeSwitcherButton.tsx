import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Modal,
  Pressable,
  UIManager,
  findNodeHandle,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeType, useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

export default function ThemeSwitcher() {
  const { theme, isDark, setTheme } = useTheme();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownAnim = useRef(new Animated.Value(0)).current;
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const buttonRef = useRef<View>(null);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const DROPDOWN_HEIGHT = 3 * 45 + 20; // Estimate height for 3 options

  // Measure button position and update layout
  const measureButton = () => {
    if (buttonRef.current) {
      const handle = findNodeHandle(buttonRef.current);
      if (handle) {
        UIManager.measure(handle, (_x, _y, width, height, pageX, pageY) => {
          setButtonLayout({ x: pageX, y: pageY, width, height });
        });
      }
    }
  };

  useEffect(() => {
    if (dropdownVisible) {
      measureButton();
      Animated.timing(dropdownAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();
    } else {
      Animated.timing(dropdownAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [dropdownVisible]);

  const handleThemeChange = useCallback(
    (newTheme: ThemeType) => {
      setTheme(newTheme);
      setDropdownVisible(false);
    },
    [setTheme]
  );

  const getThemeIcon = (themeType: ThemeType) => {
    switch (themeType) {
      case 'light':
        return <Ionicons name="sunny" size={16} color="#FFA500" />;
      case 'dark':
        return <Ionicons name="moon" size={16} color="#FFD700" />;
      case 'system':
        return <Ionicons name="phone-portrait" size={16} color={isDark ? '#ccc' : '#444'} />;
    }
  };

  const getThemeLabel = (themeType: ThemeType) => {
    switch (themeType) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
    }
  };

  const dropdownStyle = {
    opacity: dropdownAnim,
    transform: [
      {
        scale: dropdownAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        }),
      },
    ],
  };

  // Calculate dropdown position dynamically
  const calculateDropdownPosition = () => {
    const showAbove = buttonLayout.y + buttonLayout.height + DROPDOWN_HEIGHT > screenHeight;
    const adjustedTop = showAbove ? buttonLayout.y - DROPDOWN_HEIGHT - 4 : buttonLayout.y + buttonLayout.height + 4;

    const adjustedLeft = Math.min(buttonLayout.x, screenWidth - 180); // Avoid going out of screen

    return {
      top: adjustedTop,
      left: adjustedLeft,
    };
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        ref={buttonRef}
        style={[styles.button, isDark && styles.buttonDark]}
        onPress={() => {
          setDropdownVisible((prev) => !prev);
          setTimeout(measureButton, 0); // Ensure layout is updated
        }}
        activeOpacity={0.8}
      >
        {getThemeIcon(theme)}
      </TouchableOpacity>

      {dropdownVisible && (
        <Modal
          transparent
          animationType="none"
          visible={dropdownVisible}
          onRequestClose={() => setDropdownVisible(false)}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setDropdownVisible(false)}>
            <Animated.View
              style={[
                styles.dropdown,
                isDark && styles.dropdownDark,
                dropdownStyle,
                calculateDropdownPosition(),
                {
                  minWidth: buttonLayout.width,
                },
              ]}
            >
              {(['light', 'dark', 'system'] as ThemeType[]).map((themeOption) => {
                const isActive = theme === themeOption;
                return (
                  <TouchableOpacity
                    key={themeOption}
                    style={[
                      styles.dropdownItem,
                      isActive && (isDark ? styles.activeItemDark : styles.activeItem),
                    ]}
                    onPress={() => handleThemeChange(themeOption)}
                    activeOpacity={0.7}
                  >
                    {getThemeIcon(themeOption)}
                    <Text
                      style={[
                        styles.dropdownText,
                        isDark && styles.textDark,
                        isActive && styles.activeText,
                      ]}
                    >
                      {getThemeLabel(themeOption)}
                    </Text>
                    {isActive && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={isDark ? '#003566' : '#000'}
                        style={{ marginLeft: 'auto' }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </Animated.View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#8da9c4',
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  buttonDark: {
    backgroundColor: '#003566',
    borderColor: '#8da9c4',
  },
  textDark: {
    color: '#8da9c4',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#ffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    elevation: 5,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  dropdownDark: {
    backgroundColor: '#003566',
    borderColor: '#8da9c4',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,

  },
  activeItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  activeItemDark: {
    backgroundColor: '#333',
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 14,
    color: '#8da9c4',
  },
  activeText: {
    fontWeight: '600',
  },
});


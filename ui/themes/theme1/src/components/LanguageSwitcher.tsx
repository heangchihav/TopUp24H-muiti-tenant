import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Modal,
  Image,
  Pressable,
  Dimensions,
  LayoutRectangle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Language, VALID_LANGUAGES, useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { usePathname, useRouter } from 'expo-router';

const languages = [
  { code: 'en', name: 'English', avatar: 'https://res.cloudinary.com/da8ox9rlr/image/upload/flags/1x1/sh_myho2n.jpg' },
  { code: 'fr', name: 'French', avatar: 'https://res.cloudinary.com/da8ox9rlr/image/upload/flags/1x1/yt_fnqbkh.jpg' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const { theme, isDark } = useTheme();

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [buttonLayout, setButtonLayout] = useState<LayoutRectangle | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const dropdownAnim = useRef(new Animated.Value(0)).current;
  const buttonRef = useRef<View>(null);

  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  const DROPDOWN_HEIGHT = languages.length * 45 + 20; // Estimate height
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (dropdownVisible) {
      buttonRef.current?.measureInWindow((x, y, width, height) => {
        const showAbove = y + height + 4 + DROPDOWN_HEIGHT > screenHeight;
        const adjustedTop = showAbove ? y - DROPDOWN_HEIGHT - 4 : y + height + 4;

        setButtonLayout({ x, y, width, height });
        setDropdownPosition({
          top: adjustedTop,
          left: Math.min(x, screenWidth - 180), // Avoid going out of screen
        });

        Animated.timing(dropdownAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }).start();
      });
    } else {
      Animated.timing(dropdownAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [dropdownVisible]);

  const handleLanguageChange = useCallback(async (newLanguage: Language) => {
    if (VALID_LANGUAGES.includes(newLanguage)) {
      setLanguage(newLanguage);

      // Keep everything after the language segment
      const pathSegments = pathname.split('/');
      const remainingPath = pathSegments.slice(2).join('/');

      // Navigate to same path with new language
      router.push(`/${newLanguage}/${remainingPath}` as any);
      setDropdownVisible(false);
    }
  }, [setLanguage, router, pathname]);

  const getLanguageIcon = (languageCode: string) => {
    const lang = languages.find((l) => l.code === languageCode);
    return lang?.avatar ? <Image source={{ uri: lang.avatar }} style={styles.flagIcon} /> : null;
  };

  const getLanguageLabel = (languageCode: string) => {
    return languages.find((lang) => lang.code === languageCode)?.name || '';
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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isDark && styles.buttonDark]}
        onPress={() => setDropdownVisible(!dropdownVisible)}
        ref={buttonRef}
        activeOpacity={0.8}
      >
        {getLanguageIcon(language)}
      </TouchableOpacity>

      <Modal transparent visible={dropdownVisible} animationType="none" onRequestClose={() => setDropdownVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setDropdownVisible(false)}>
          <Animated.View
            style={[
              styles.dropdown,
              isDark && styles.dropdownDark,
              dropdownStyle,
              {
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                minWidth: buttonLayout?.width || 100,
              },
            ]}
          >
            {languages.map((lang) => {
              const isActive = language === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.dropdownItem,
                    isActive && (isDark ? styles.activeItemDark : styles.activeItem),
                  ]}
                  onPress={() => handleLanguageChange(lang.code as Language)}
                  activeOpacity={0.7}
                >
                  {getLanguageIcon(lang.code)}
                  <Text
                    style={[
                      styles.dropdownText,
                      isDark && styles.textDark,
                      isActive && styles.activeText,
                    ]}
                  >
                    {getLanguageLabel(lang.code)}
                  </Text>
                  {isActive && (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={isDark ? '#fff' : '#000'}
                      style={{ marginLeft: 'auto' }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        </Pressable>
      </Modal>
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
    justifyContent: 'center',
    backgroundColor: '#003566',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#8da9c4',
    gap: 2,
    width: 40,
    height: 40,
  },
  buttonDark: {
    backgroundColor: '#003566',
    borderColor: '#8da9c4',
  },
  flagIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 9999,
    paddingHorizontal: 10,
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
    borderColor: '#8da9c4'
  },
  dropdownText: {
    fontSize: 14,
    color: '#8da9c4',
  },
  activeText: {
    fontWeight: '600',
  },
  textDark: {
    color: '#8da9c4',
  },
  activeItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  activeItemDark: {
    backgroundColor: '#333',
    borderRadius: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});

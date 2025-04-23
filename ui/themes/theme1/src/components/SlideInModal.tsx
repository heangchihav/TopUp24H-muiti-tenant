import React, { useEffect, useState, useContext } from 'react';
import { Modal, View, Text, StyleSheet, Dimensions, ImageBackground, TouchableWithoutFeedback, ScrollView, TouchableOpacity, Image } from 'react-native';

import { BlurView } from 'expo-blur';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, withDelay } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { MenuItem, SlideInModalProps } from '../types/types';
import { useTheme } from '@/contexts/ThemeContext';
import UserProfile from './userProfile';

const SlideInModal: React.FC<SlideInModalProps> = ({ visible, closeModal }) => {
  const { isDark } = useTheme();
  const [showModal, setShowModal] = useState(visible);
  const [activeMenuItem, setActiveMenuItem] = useState<string | null>(null);
  const slideAnim = useSharedValue(-Dimensions.get('window').width);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const menuItems: MenuItem[] = [
    { id: '1', title: 'Contact', screen: 'contact' },
  
  ];

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      slideAnim.value = withTiming(0, { duration: 300 });
    } else {
      slideAnim.value = withTiming(-Dimensions.get('window').width, { duration: 300 });
      setTimeout(() => setShowModal(false), 300);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideAnim.value }],
  }));

  const handleMenuItemPress = (id: string, screen: keyof RootStackParamList) => {
    setActiveMenuItem(id);
    closeModal();
    navigation.navigate(screen);
  };

  const modalBackgroundImage = isDark
    ? 'https://img.freepik.com/premium-photo/vibrant-blue-poker-table-background-sets-stage-exciting-gameplay_1000124-99940.jpg'
    : 'https://img.freepik.com/premium-photo/lucky-love-closeup-view-red-casino-dice-ultimate-gamblers_983420-240197.jpg';

  const headerImage = isDark
    ? 'https://res.cloudinary.com/da8ox9rlr/image/upload/v1724657760/icg/Snipaste_2024-08-26_02-35-23_dut26h.png'
    : 'https://thumbs.dreamstime.com/b/horizontal-red-casino-background-your-pad-your-screen-55173136.jpg';

  const menuItemBackground = isDark
    ? 'https://static.vecteezy.com/system/resources/previews/035/973/649/large_2x/ai-generated-casino-theme-playing-cards-chips-and-golden-coins-on-black-background-concept-of-casino-game-poker-card-playing-gambling-chips-in-a-black-and-gold-style-banner-backdrop-background-free-photo.jpg'
    : 'https://img.freepik.com/free-psd/realistic-casino-items-illustration_23-2150688787.jpg';


  return (
    <Modal transparent statusBarTranslucent visible={showModal} onRequestClose={closeModal}>
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalBackground}>
          <View style={styles.overlay} />
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modalContainer, animatedStyle]}>
              <ImageBackground
                source={{ uri: modalBackgroundImage }}
                style={styles.modalBackgroundImage}
                resizeMode="cover"
              >
                <View style={styles.headerSection}>
                  <Image
                    source={{ uri: headerImage }}
                    style={styles.headerImage}
                    resizeMode="cover"
                  />

                  {/* Wrap AvatarModal if needed, and position it */}
                  <View style={styles.avatarWrapper}>
                    <UserProfile/>
                  </View>
                </View>

                <View style={styles.dividerLine} />

                <BlurView
                  style={styles.glassEffect}
                  intensity={50}
                  tint={isDark ? 'dark' : 'light'}
                >
                  <ScrollView contentContainerStyle={styles.scrollView}>

                    {menuItems.map((item, index) => {
                      const translateY = useSharedValue(-20);
                      const opacity = useSharedValue(0);
                      useEffect(() => {
                        if (visible) {
                          // Apply delay using `withDelay`
                          translateY.value = withDelay(
                            index * 75, // Delay time in milliseconds
                            withSpring(0, { mass: 0.5, damping: 10, stiffness: 150 })
                          );
                          opacity.value = withDelay(
                            index * 50,
                            withSpring(1)
                          );
                        } else {
                          // Animate without delay
                          translateY.value = withTiming(-20, { duration: 500 });
                          opacity.value = withTiming(0, { duration: 500 });
                        }
                      }, [visible]);

                      const animatedItemStyle = useAnimatedStyle(() => ({
                        transform: [{ translateY: translateY.value }],
                        opacity: opacity.value,
                      }));

                      const isActive = item.id === activeMenuItem;

                      return (
                        <Animated.View key={item.id} style={[styles.menuItemContainer, animatedItemStyle]}>
                          <TouchableOpacity
                            onPress={() => handleMenuItemPress(item.id, item.screen)}
                            style={[
                              styles.menuItemContainer,
                              isActive && styles.activeMenuItemContainer,
                            ]}
                          >
                            <ImageBackground
                              source={{ uri: menuItemBackground }}
                              style={styles.menuItemBackground}
                              resizeMode="cover"
                            >
                              <Svg height="40" width="100%" style={styles.gradientText}>
                                <Defs>
                                  <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <Stop offset="0%" stopColor="#FF6F00" />
                                    <Stop offset="100%" stopColor="#FFAB00" />
                                  </LinearGradient>
                                </Defs>
                                <SvgText
                                  x="50%"
                                  y="50%"
                                  fontSize="18"
                                  fill="url(#grad)"
                                  textAnchor="middle"
                                  dy=".3em"
                                  fontWeight="bold"
                                >
                                  {item.title}
                                </SvgText>
                              </Svg>
                            </ImageBackground>
                          </TouchableOpacity>
                        </Animated.View>
                      );
                    })}
                  </ScrollView>
                </BlurView>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </ImageBackground>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '90%',
    maxWidth: 400,
    height: '100%',
    backgroundColor: 'transparent',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  modalBackgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  headerSection: {
    height: 190,
    justifyContent: 'center',
    alignItems: 'flex-start',
    overflow: 'hidden',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 20,
    marginTop: 30,
    position: 'relative', // important to anchor absolute children
  },
  headerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  avatarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },


  dividerLine: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 10,
    marginHorizontal: 30,
  },
  glassEffect: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  scrollView: {
    padding: 15,
    gap: 15,
  },
  menuItemContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  menuItemBackground: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },



  gradientText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeMenuItemContainer: {
    borderColor: '#FFAB00',
    borderTopWidth: 3,
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20,
    shadowColor: "#FFAB00",
    transform: [{ scale: 1 }],
    backgroundColor: '#FFAB00',
  },
  closeButton: {
    backgroundColor: '#FF6F00',
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 10,
    marginVertical: 10

  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default SlideInModal;

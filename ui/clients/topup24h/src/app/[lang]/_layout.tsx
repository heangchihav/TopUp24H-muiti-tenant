import React, { useContext, useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider as NavigationThemeProvider, useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { View } from 'react-native';
import Navbar from '@/components/Navbar';
import { Language, useLanguage } from '../../contexts/LanguageContext';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import ContactPage from '@/screens/ContactScreen';
import SmallScreenNav from '@/components/SmallScreenNav';
import ModalComponent from '@/components/Modal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SplashScreen, Tabs, usePathname } from 'expo-router';
import { useIsLargeScreen } from '@/hooks/useIsLargeScreen';
import { useTheme } from '@/contexts/ThemeContext';
import HomeScreen from '@/screens/HomeScreen';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ContactScreen from '@/screens/ContactScreen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const LanguageLayout = () => {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const isLargeScreen = useIsLargeScreen();
  const [loaded] = useFonts({
    SpaceMono: require('../../../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const pathname = usePathname();
  const { setLanguage } = useLanguage();
  const [newsModalVisible, setNewsModalVisible] = useState(false);
  const navigation = useNavigation();
  const Tabs = createBottomTabNavigator();
  const Stack = createStackNavigator();

  useEffect(() => {
    const handleLanguageChange = async () => {
      const urlLanguage = (pathname.split('/')[1] as Language);
      const validLanguages: Language[] = ['en', 'fr'];
      if (validLanguages.includes(urlLanguage)) {
        setLanguage(urlLanguage);
        await AsyncStorage.setItem('language', urlLanguage);
      } else {
        navigation.goBack();
      }
    };

    async function initialize() {
      const hasVisited = await AsyncStorage.getItem('hasVisited');
      if (!hasVisited) {
        setNewsModalVisible(true);
        await AsyncStorage.setItem('hasVisited', 'true');
      }
    }

    handleLanguageChange();
    initialize();

    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, pathname, setLanguage]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: isDark ? '#000000' : '#ffffff' }}>
      {isLargeScreen ? (
        <View style={{ flex: 1}}>
          <View style={{ height: 1}}></View>
          <Stack.Navigator initialRouteName="index" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" component={HomeScreen} />
            <Stack.Screen name="contact" component={ContactPage} />
          </Stack.Navigator>
        </View>
      ) : (
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ zIndex: 1 }}>
            <SmallScreenNav />
          </View>
          <View style={{ flex: 1 }}>
            <Tabs.Navigator
              screenOptions={{
                headerShown: false,
                tabBarStyle: {
                  backgroundColor: isDark ? '#1a1a1a' : 'white',
                  borderTopColor: isDark ? '#333' : '#e5e5e5',
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: isDark ? '#888' : '#666',
              }}
            >
              <Tabs.Screen
                name="index"
                component={HomeScreen}
                options={{
                  title: language === 'fr' ? 'Accueil' : 'Home',
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="contact"
                component={ContactScreen}
                options={{
                  title: language === 'fr' ? 'Compte' : 'Account',
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
                  ),
                }}
              />
            </Tabs.Navigator>
          </View>
        </SafeAreaView>
      )}

      <ModalComponent visible={newsModalVisible} onClose={() => setNewsModalVisible(false)} />
    </GestureHandlerRootView>
  );
}

export default LanguageLayout;

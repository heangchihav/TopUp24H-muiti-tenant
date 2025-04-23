import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Slider from '@/components/Slider';
import Card from '@/components/Card';
import { data } from '@/data/CardData';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useIsLargeScreen } from '@/hooks/useIsLargeScreen';
import GameButton from '@/components/GameButton';

interface CardItem {
  id: string | number;
  status: string;
  title: string;
  image: string;
  screen: string;
}

interface CategoryData {
  title: string;
}

interface SectionData {
  [key: string]: [CategoryData, { [key: string]: CardItem[] }];
}

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen(): JSX.Element {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const isLargeScreen = useIsLargeScreen();

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#000b59' : '#ffffff' }}>
      {isLargeScreen && <Navbar />}

      <ScrollView
        style={[
          styles.container,
          { backgroundColor: isDark ? '#000b59' : '#ffffff' },
        ]}
        contentContainerStyle={styles.scrollContent}
      >
        <Slider />
        <View style={styles.sectionButton}>

          <GameButton title="Popular" onPress={() => console.log('Game button pressed')} />
          <GameButton title="Game" onPress={() => console.log('Game button pressed')} />
          <GameButton title="App" onPress={() => console.log('Game button pressed')} />


        </View>

        {(data as SectionData[]).map((section, index) => {
          const categoryKey = Object.keys(section)[0];
          const [categoryMeta, itemsData] = section[categoryKey];
          const itemsKey = Object.keys(itemsData)[0];
          const items = itemsData[itemsKey];

          return (
            <View key={index} style={styles.sectionWrapper}>
              <View style={styles.section}>
                <View style={styles.headerContainer}>
                  <Text style={[styles.text, { color: isDark ? '#fff' : '#000' }]}>
                    {categoryMeta.title}
                  </Text>
                </View>

                <View style={styles.grid}>
                  {items.map((item: CardItem) => (
                    <View
                      key={item.id}
                      style={[
                        styles.cardWrapper,
                        {
                          flexBasis:
                            screenWidth >= 1600
                              ? '19%'      // 5 per row
                              : screenWidth >= 1280
                                ? '23.5%'    // 4 per row
                                : screenWidth >= 1024
                                  ? '30.5%'    // 3 per row
                                  : screenWidth >= 280
                                    ? '47.5%'    // 2 per row (small phones and up)
                                    : '100%',    // super small (smartwatch etc.)
                        },
                      ]}
                    >
                      <Card
                        status={item.status}
                        title={item.title}
                        image={item.image}
                        screen={item.screen}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </View>
          );
        })}

        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  sectionButton: {
    width: '100%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10, // Optional, use if you want some spacing between sections
  },
  sectionWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  section: {
    width: '100%',
    maxWidth: 1500,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  headerContainer: {
    marginBottom: 12,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10, // Optional, use if you want some spacing between cards
  },
  cardWrapper: {
    marginVertical: 10,
  },
});

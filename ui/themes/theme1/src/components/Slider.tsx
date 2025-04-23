import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewToken,
    useWindowDimensions,
} from 'react-native';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ImageSlider, ImageSliderType } from '@/data/SliderData';
import { useIsLargeScreen } from '@/hooks/useIsLargeScreen';
import { Ionicons as Icon } from '@expo/vector-icons';

const Slider = () => {
    const isLargeScreen = useIsLargeScreen();
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isManualScrolling, setIsManualScrolling] = useState(false);
    const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);
    const resumeAutoScrollTimer = useRef<NodeJS.Timeout | null>(null);
    const { width } = useWindowDimensions();

    const scrollToIndex = useCallback((index: number) => {
        flatListRef.current?.scrollToIndex({ index, animated: true });
    }, []);

    const scrollToNext = useCallback(() => {
        const nextIndex =
            currentIndex === ImageSlider.length - 1 ? 0 : currentIndex + 1;
        scrollToIndex(nextIndex);
    }, [currentIndex, scrollToIndex]);

    const scrollToPrev = useCallback(() => {
        const prevIndex =
            currentIndex === 0 ? ImageSlider.length - 1 : currentIndex - 1;
        scrollToIndex(prevIndex);
    }, [currentIndex, scrollToIndex]);

    const startAutoScroll = () => {
        stopAutoScroll(); // Clear any existing first
        autoScrollTimer.current = setInterval(scrollToNext, 3000);
    };

    const stopAutoScroll = () => {
        if (autoScrollTimer.current) {
            clearInterval(autoScrollTimer.current);
            autoScrollTimer.current = null;
        }
    };

    const pauseAndResumeAutoScroll = () => {
        stopAutoScroll();
        if (resumeAutoScrollTimer.current) {
            clearTimeout(resumeAutoScrollTimer.current);
        }
        resumeAutoScrollTimer.current = setTimeout(() => {
            setIsManualScrolling(false);
            startAutoScroll();
        }, 4000); // 4 seconds pause after user stops scrolling
    };

    const handleScrollToIndexFailed = useCallback((info: { index: number }) => {
        setTimeout(() => {
            flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
            });
        }, 500);
    }, []);

    useEffect(() => {
        startAutoScroll();
        return () => {
            stopAutoScroll();
            if (resumeAutoScrollTimer.current) {
                clearTimeout(resumeAutoScrollTimer.current);
            }
        };
    }, [currentIndex]);

    const onScrollBegin = () => {
        setIsManualScrolling(true);
        pauseAndResumeAutoScroll();
    };

    const viewabilityConfig = { itemVisiblePercentThreshold: 50 };
    const viewabilityConfigCallbackPairs = useRef([
        {
            onViewableItemsChanged: ({
                viewableItems,
            }: {
                viewableItems: ViewToken[];
            }) => {
                const visibleItem = viewableItems[0];
                if (visibleItem && visibleItem.index !== null) {
                    setCurrentIndex(visibleItem.index);
                }
            },
            viewabilityConfig,
        },
    ]);

    const data = ImageSlider.length > 0 ? ImageSlider : [];

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={data}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Image
                            source={{ uri: item.image }}
                            style={[
                                styles.image,
                                { height: isLargeScreen ? 500 : 200 },
                            ]}
                        />

                        {/* Arrows inside the image */}
                        <TouchableOpacity
                            style={styles.leftArrowInImage}
                            onPress={scrollToPrev}
                        >
                            <View style={styles.arrowContainer}>
                                <Icon name="chevron-back" size={24} color="#fff" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.rightArrowInImage}
                            onPress={scrollToNext}
                        >
                            <View style={styles.arrowContainer}>
                                <Icon name="chevron-forward" size={24} color="#fff" />
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={(_, index) => index.toString()}
                onScrollBeginDrag={onScrollBegin}
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                getItemLayout={(_, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                })}
                onScrollToIndexFailed={handleScrollToIndexFailed}
            />

            {/* Indicator Dots */}
            <View style={styles.dotsContainer}>
                {ImageSlider.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentIndex === index && styles.activeDot,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

export default Slider;

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        position: 'relative',
    },
    itemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        paddingHorizontal: 20,
        // backgroundColor: '#fff',
    },
    image: {
        width: Dimensions.get('window').width - 40,
        borderRadius: 20,
        resizeMode: 'cover',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#c3e6ff',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#ff9300',
        width: 15,
        height: 10,
        borderRadius: 30,
    },
    leftArrowInImage: {
        position: 'absolute',
        left: 30,
        top: '50%',
        transform: [{ translateY: -20 }],
        zIndex: 10,
    },
    rightArrowInImage: {
        position: 'absolute',
        right: 30,
        top: '50%',
        transform: [{ translateY: -20 }],
        zIndex: 10,
    },
    arrowContainer: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 8,
        borderRadius: 999,
    },
});

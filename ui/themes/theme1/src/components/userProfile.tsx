import React, { useContext, useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Switch,
    Image,
    Modal, Animated as Ani
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, UserProfileProps } from '../types/types';
import { BlurView } from 'expo-blur';
import { Colors } from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import ThemeSwitcher from './ThemeSwitcherButton';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';


const UserProfile: React.FC<UserProfileProps> = () => {
    const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);
    const scaleAnim = useRef(new Ani.Value(1)).current; // Initial scale value
    const toggleAvatarModal = () => {
        if (isAvatarModalVisible) {
            // Animate scale back to 1
            Ani.timing(scaleAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }).start();
        } else {
            // Animate scale to 1.2
            Ani.timing(scaleAnim, {
                toValue: 1.2,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
        setAvatarModalVisible(!isAvatarModalVisible);
    };

    const user: User = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatarUri: 'https://image.winudf.com/v2/image1/Y29tLkFuaW1lQm95cy5Qcm9maWxlUGljdHVyZXNfc2NyZWVuXzBfMTY5MTgyMzI5MF8wMzk/screen-0.jpg?fakeurl=1&type=.jpg',
    };


    const { isDark } = useTheme();
    const [form, setForm] = useState({
        emailNotifications: true,
        pushNotifications: false,
    });

    // Shared values for each section to animate them
    const springValue1 = useSharedValue(300);
    const springValue2 = useSharedValue(300);
    const springValue3 = useSharedValue(300);
    const springValue4 = useSharedValue(300);

    useEffect(() => {
        if (isAvatarModalVisible) {
            // Trigger the spring animations when modal becomes visible
            springValue1.value = withSpring(0, { mass: 0.5, damping: 10, stiffness: 150 });
            setTimeout(() => {
                springValue2.value = withSpring(0, { mass: 0.5, damping: 10, stiffness: 150 });
            }, 50);
            setTimeout(() => {
                springValue3.value = withSpring(0, { mass: 0.5, damping: 10, stiffness: 150 });
            }, 100);
            setTimeout(() => {
                springValue4.value = withSpring(0, { mass: 0.5, damping: 10, stiffness: 150 });
            }, 150);
        } else {
            // Reset the spring values to their initial off-screen position
            springValue1.value = 300;
            springValue2.value = 300;
            springValue3.value = 300;
            springValue4.value = 300;
        }
    }, [isAvatarModalVisible]);

    // Animated styles for each section
    const animatedStyle1 = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: springValue1.value }],
        };
    });

    const animatedStyle2 = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: springValue2.value }],
        };
    });

    const animatedStyle3 = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: springValue3.value }],
        };
    });
    const animatedStyle4 = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: springValue4.value }],
        };
    });
    const { language } = useLanguage(); // Get the current language
    const animatedStyle = {
        transform: [{ scale: scaleAnim }]
    };
    return (
        <View >
            <View>
                <TouchableOpacity onPress={toggleAvatarModal}>
                    <LinearGradient
                        colors={['#bf5b04', '#ffcc00', "#e80008"]}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.gradientBorder}
                    >
                        <Animated.Image
                            source={{ uri: user.avatarUri }}
                            style={[styles.avatar, animatedStyle]}
                        />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
            <View>
                <Modal transparent visible={isAvatarModalVisible} onRequestClose={toggleAvatarModal} animationType='fade'>
                    <BlurView intensity={100} tint={'dark'} style={styles.blurBackground}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalContent}>
                                <View style={{ flex: 1, backgroundColor: '', borderRadius: 20, width: "100%", height: "100%" }}>
                                    <LinearGradient
                                        colors={isDark ? ['#ff7708', "#ffce08"] : ['#ffffff', '#ffffff']}
                                        style={[styles.header]}
                                        start={[0, 1]}
                                        end={[1, 0]}>
                                        <View style={styles.headerAction}>
                                            <TouchableOpacity onPress={toggleAvatarModal}>
                                                <FeatherIcon color={isDark ? Colors.dark.text : Colors.light.text} name="arrow-left" size={24} />
                                            </TouchableOpacity>
                                        </View>

                                        <Text numberOfLines={1} style={[styles.headerTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
                                            Settings
                                        </Text>

                                        <View style={[styles.headerAction, { alignItems: 'flex-end' }]}>
                                            <TouchableOpacity onPress={() => { }}>
                                                <FeatherIcon color={isDark ? Colors.dark.text : Colors.light.text} name="more-vertical" size={24} />
                                            </TouchableOpacity>
                                        </View>
                                    </LinearGradient>

                                    <ScrollView contentContainerStyle={styles.content}>
                                        {/* First Section with Spring Animation */}
                                        <Animated.View style={[styles.section, { paddingTop: 4 }, animatedStyle1]}>
                                            <Text style={styles.sectionTitle}>Account</Text>
                                            <View style={styles.sectionBody}>
                                                <TouchableOpacity style={styles.profile}>
                                                    <Image
                                                        source={{
                                                            uri: user.avatarUri,
                                                        }}
                                                        style={styles.profileAvatar}
                                                    />
                                                    <View style={styles.profileBody}>
                                                        <Text style={styles.profileName}>{user.name}</Text>
                                                        <Text style={styles.profileHandle}>{user.email}</Text>
                                                    </View>
                                                    <FeatherIcon color="#bcbcbc" name="chevron-right" size={22} />
                                                </TouchableOpacity>
                                            </View>
                                        </Animated.View>



                                        {/* Second Section with Spring Animation */}
                                        <Animated.View style={[styles.section, animatedStyle2]}>
                                            <Text style={styles.sectionTitle}>Preferences</Text>
                                            <View style={styles.sectionBody}>
                                                <View style={[styles.rowWrapper, styles.rowFirst]}>
                                                    <View style={[styles.row, { zIndex: 9999 }]}>
                                                        <Text style={styles.rowLabel}>Language</Text>
                                                        <View style={styles.rowSpacer} />
                                                        <Text style={styles.rowValue}>{language}</Text>
                                                        <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                                                        <View>
                                                            <LanguageSwitcher />
                                                        </View>
                                                    </View>
                                                </View>

                                                <View style={styles.rowWrapper}>
                                                    <TouchableOpacity onPress={() => { /* handle onPress */ }} style={styles.row}>
                                                        <Text style={styles.rowLabel}>Location</Text>
                                                        <View style={styles.rowSpacer} />
                                                        <Text style={styles.rowValue}>Los Angeles, CA</Text>
                                                        <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                                                    </TouchableOpacity>
                                                </View>

                                                <View style={styles.rowWrapper}>
                                                    <View style={styles.row}>
                                                        <Text style={styles.rowLabel}>Email Notifications</Text>
                                                        <View style={styles.rowSpacer} />
                                                        <Switch
                                                            onValueChange={emailNotifications => setForm({ ...form, emailNotifications })}
                                                            style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                                                            value={form.emailNotifications}
                                                        />
                                                    </View>
                                                </View>

                                                <View style={styles.rowWrapper}>
                                                    <View style={styles.row}>
                                                        <Text style={styles.rowLabel}>Push Notifications</Text>
                                                        <View style={styles.rowSpacer} />
                                                        <Switch
                                                            onValueChange={pushNotifications => setForm({ ...form, pushNotifications })}
                                                            style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                                                            value={form.pushNotifications}
                                                        />
                                                    </View>
                                                </View>

                                                <View style={[styles.rowWrapper, styles.rowLast]}>
                                                    <View style={styles.row}>
                                                        <Text style={styles.rowLabel}>Change Theme</Text>
                                                        <View style={styles.rowSpacer} />
                                                        <ThemeSwitcher />
                                                    </View>
                                                </View>
                                            </View>
                                        </Animated.View>

                                        {/* Third Section with Spring Animation */}
                                        <Animated.View style={[styles.section, animatedStyle3]}>
                                            <Text style={styles.sectionTitle}>Resources</Text>
                                            <View style={styles.sectionBody}>
                                                <View style={[styles.rowWrapper, styles.rowFirst]}>
                                                    <TouchableOpacity onPress={() => { /* handle onPress */ }} style={styles.row}>
                                                        <Text style={styles.rowLabel}>Contact Us</Text>
                                                        <View style={styles.rowSpacer} />
                                                        <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={styles.rowWrapper}>
                                                    <TouchableOpacity onPress={() => { /* handle onPress */ }} style={styles.row}>
                                                        <Text style={styles.rowLabel}>Report Bug</Text>
                                                        <View style={styles.rowSpacer} />
                                                        <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={styles.rowWrapper}>
                                                    <TouchableOpacity onPress={() => { /* handle onPress */ }} style={styles.row}>
                                                        <Text style={styles.rowLabel}>Rate in App Store</Text>
                                                        <View style={styles.rowSpacer} />
                                                        <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={[styles.rowWrapper, styles.rowLast]}>
                                                    <TouchableOpacity onPress={() => { /* handle onPress */ }} style={styles.row}>
                                                        <Text style={styles.rowLabel}>Terms and Privacy</Text>
                                                        <View style={styles.rowSpacer} />
                                                        <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </Animated.View>

                                        <Animated.View style={[styles.section, animatedStyle4]}>
                                            <View style={styles.sectionBody}>
                                                <View style={[styles.rowWrapper, styles.rowFirst, styles.rowLast, { alignItems: 'center' }]}>
                                                    <TouchableOpacity onPress={() => { /* handle onPress */ }} style={styles.row}>
                                                        <Text style={[styles.rowLabel, styles.rowLabelLogout]}>Log Out</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </Animated.View>
                                    </ScrollView>
                                </View>
                            </View>
                        </View>
                    </BlurView>
                </Modal>
            </View>
        </View>
    );
};
export default UserProfile;

const styles = StyleSheet.create({
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: 'transparent', // Border color is managed by gradient
    },
    gradientBorder: {
        borderRadius: 50,
    },
    blurBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    modalContent: {
        width: '90%', // Adjust width based on screen size
        maxWidth: 600, // Maximum width for larger screens
        height: '90%', // Adjust height
    },
    /** Header */
    header: {
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 16,
    },
    headerAction: {
        width: 40,
        height: 40,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 19,
        fontWeight: '600',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        textAlign: 'center',
    },
    /** Content */
    content: {
        paddingHorizontal: 16,
    },
    contentFooter: {
        marginTop: 24,
        fontSize: 13,
        fontWeight: '500',
        textAlign: 'center',
        color: '#a69f9f',
    },
    /** Section */
    section: {
        paddingVertical: 12,
    },
    sectionTitle: {
        margin: 8,
        marginLeft: 12,
        fontSize: 13,
        letterSpacing: 0.33,
        fontWeight: '500',
        color: '#a69f9f',
        textTransform: 'uppercase',
    },
    sectionBody: {
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    /** Profile */
    profile: {
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    profileAvatar: {
        width: 60,
        height: 60,
        borderRadius: 9999,
        marginRight: 12,
    },
    profileBody: {
        marginRight: 'auto',
    },
    profileName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#292929',
    },
    profileHandle: {
        marginTop: 2,
        fontSize: 16,
        fontWeight: '400',
        color: '#858585',
    },
    /** Row */
    row: {
        height: 44,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingRight: 12,
    },
    rowWrapper: {
        paddingLeft: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#f0f0f0',
    },
    rowFirst: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    rowLabel: {
        fontSize: 16,
        letterSpacing: 0.24,
        color: '#000',
    },
    rowSpacer: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    rowValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ababab',
        marginRight: 4,
    },
    rowLast: {
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    rowLabelLogout: {
        width: '100%',
        textAlign: 'center',
        fontWeight: '600',
        color: '#dc2626',
    },

});
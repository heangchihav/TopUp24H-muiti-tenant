import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    useWindowDimensions,
} from 'react-native';

export default function Footer() {
    return (
        <View style={styles.footer}>
            <View style={styles.gridContainer}>
                {/* Brand Section */}
                <View style={styles.column}>
                    <Image
                        source={{ uri: 'https://yourcdn.com/logo.png' }}
                        style={styles.logo}
                    />
                    <Text style={styles.brand}>TopUpPro</Text>
                    <Text style={styles.textMuted}>
                        Fast & secure top-up for your favorite games and services.
                    </Text>
                </View>

                {/* Navigation */}
                <View style={styles.column}>
                    <Text style={styles.heading}>Quick Links</Text>
                    {['Home', 'Top Up', 'Promotions', 'Support', 'FAQ'].map((link, i) => (
                        <TouchableOpacity key={i}>
                            <Text style={styles.link}>{link}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Payment Methods */}
                <View style={styles.column}>
                    <Text style={styles.heading}>Payment Methods</Text>
                    <View style={styles.paymentRow}>
                        {[
                            'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png',
                            'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png',
                            'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
                            'https://upload.wikimedia.org/wikipedia/commons/4/4e/Stripe_Logo%2C_revised_2016.svg',
                        ].map((uri, index) => (
                            <Image key={index} source={{ uri }} style={styles.paymentIcon} />
                        ))}
                    </View>
                </View>

                {/* Contact Info */}
                <View style={styles.column}>
                    <Text style={styles.heading}>Contact Us</Text>
                    <Text style={styles.contactText}>📧 support@topuppro.com</Text>
                    <Text style={styles.contactText}>💬 Telegram: @TopUpProSupport</Text>
                    <Text style={styles.contactText}>🟢 Live Chat 24/7</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.bottomNote}>© 2025 TopUpPro. All rights reserved.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        backgroundColor: '#121212',
        paddingVertical: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
        width: '100%',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 1200,
    },
    column: {
        width: '100%',
        maxWidth: 280,
        margin: 12,
        alignItems: 'center',
    },
    logo: {
        width: 60,
        height: 60,
        marginBottom: 10,
        resizeMode: 'contain',
    },
    brand: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
    },
    textMuted: {
        color: '#bbbbbb',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    heading: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 10,
    },
    link: {
        fontSize: 14,
        color: '#aaaaaa',
        marginBottom: 6,
        textAlign: 'center',
    },
    paymentRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
    },
    paymentIcon: {
        width: 50,
        height: 30,
        margin: 6,
        resizeMode: 'contain',
    },
    contactText: {
        color: '#cccccc',
        fontSize: 13,
        marginVertical: 4,
        textAlign: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#2a2a2a',
        width: '90%',
        marginTop: 30,
    },
    bottomNote: {
        color: '#777',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 16,
    },
});

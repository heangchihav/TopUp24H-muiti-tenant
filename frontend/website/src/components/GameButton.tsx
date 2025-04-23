// components/GameButton.tsx
import React from 'react';
import { Text, Pressable, StyleSheet, View, ViewStyle, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type GameButtonProps = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
};

const GameButton: React.FC<GameButtonProps> = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.shadowContainer, style]}>
      <View style={styles.borderWrapper}>
        <LinearGradient
          colors={['#0d2c61', '#7ea4cb']} // dark to light blue
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.button}
        >
          <Text style={styles.text}>{title}</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  borderWrapper: {
    borderRadius: 10,
    borderWidth: 4,
    borderColor: '#9bbde0',
    overflow: 'hidden', 
  },
  button: {
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 10,
    width: 100,
    height: 20,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GameButton;

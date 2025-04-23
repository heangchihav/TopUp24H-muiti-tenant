import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface CardProps {
  title: string;
  image: string;
  status: string;
  screen: string;
}

const Card: React.FC<CardProps> = ({ title, image, screen, status }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(screen as never)}
      style={styles.card}
    >
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={[styles.title, status === 'active' ? { backgroundColor: 'rgb(255, 255, 255)', } : { backgroundColor: 'rgba(255, 255, 255, 0.5)' }]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30,
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 8,
    margin: 10,
    width: '100%',
    borderRadius: 8,

  },
});

import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,

  ActivityIndicator,
  AsyncStorage,
  //Button,
  StatusBar,
} from 'react-native';
import {
  Title,
  Caption,
  Paragraph,
  Card,
  Button
} from 'react-native-paper';
import { WebBrowser } from 'expo';
import * as firebase from 'firebase';

import { MonoText } from '../components/StyledText';
import QuestionCard from '../components/QuestionCard';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };

  render() {
    return (
      <View style={styles.container}>
        <QuestionCard />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
    backgroundColor: '#ddd'
  },
});

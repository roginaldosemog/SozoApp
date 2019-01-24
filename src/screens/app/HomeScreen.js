import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import {
  Title,
  Caption,
  Paragraph,
  Card,
  Button,
  Appbar
} from 'react-native-paper';
import { WebBrowser } from 'expo';
import * as firebase from 'firebase';

import { MonoText } from '../../components/StyledText';
import QuestionCard from '../../components/QuestionCard';

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Home',
      headerRight: (
        <Appbar.Action
          icon="person"
          onPress={() => navigation.navigate('Profile')}
        />
      ),
    };
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

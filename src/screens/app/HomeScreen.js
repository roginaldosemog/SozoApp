import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import * as firebase from 'firebase';
import QuestionCard from '../../components/QuestionCard';

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
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
    paddingTop: (StatusBar.currentHeight + 4),
    padding: 4,
    backgroundColor: '#ddd'
  },
});

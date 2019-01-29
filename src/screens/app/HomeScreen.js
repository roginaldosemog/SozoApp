import React from 'react';
import { View, StyleSheet, StatusBar, Text } from 'react-native';
import { LinearGradient } from 'expo';
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
        <View style={{flex: 1}}>
          <QuestionCard />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#bb1111'
  },
});

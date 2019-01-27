import React from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import * as firebase from 'firebase';

import ApiKeys from '../constants/ApiKeys';

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);

    //Initialize firebase
    if (!firebase.apps.length) firebase.initializeApp(ApiKeys.FirebaseConfig);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? 'Main' : 'Auth')
    })
  }

  // Render any loading content that you like here
  render() {
    return (
      <ImageBackground source={require('../assets/images/splash.png')} style={styles.container}>
        <ActivityIndicator size="large" color="#881111" style={styles.indicator}/>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  indicator: {
    marginBottom: 72,
  },
});

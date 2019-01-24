import React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import * as firebase from 'firebase';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile (Temp)',
  };

  _signOutAsync = async () => {
    await firebase.auth().signOut()
    .then(() => {
      console.log("SignOut Sucessful!");
      this.props.navigation.navigate('Auth');
    }, (error) => {
      Alert.alert(error.message);
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="Sign me out :)" onPress={this._signOutAsync} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    marginHorizontal: 50
  },
});

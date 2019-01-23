import React from 'react';
// import { StyleSheet, View, Text } from 'react-native';
// import { Card, Button, TextInput, HelperText } from 'react-native-paper';
import { ActivityIndicator, AsyncStorage, StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import * as firebase from 'firebase';

export default class SignUpScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  };

  render() {
    return (
      <View style={{paddingTop:50, alignItems:"center"}}>

        <Text>Signup</Text>

        <TextInput style={{width: 200, height: 40, borderWidth: 1}}
          value={this.state.name}
          onChangeText={(text) => { this.setState({name: text}) }}
          placeholder="Name"
          autoCorrect={false}
        />

        <View style={{paddingTop:10}} />

        <TextInput style={{width: 200, height: 40, borderWidth: 1}}
          value={this.state.email}
          onChangeText={(text) => { this.setState({email: text}) }}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={{paddingTop:10}} />

        <TextInput style={{width: 200, height: 40, borderWidth: 1}}
          value={this.state.password}
          onChangeText={(text) => { this.setState({password: text}) }}
          placeholder="Password"
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={{paddingTop:10}} />

        <TextInput style={{width: 200, height: 40, borderWidth: 1}}
          value={this.state.passwordConfirm}
          onChangeText={(text) => { this.setState({passwordConfirm: text}) }}
          placeholder="Password (confirm)"
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Button title="Signup" onPress={this._signUpAsync} />

        <Button title="Back to Login" onPress={this._backToSignIn} />
      </View>
    );
  }

  _signUpAsync = async () => {
    if (this.state.password != this.state.passwordConfirm) {
      Alert.alert("Passwords do not match");
      return;
    }

    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then(() => {
      var user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: this.state.name,
        // photoURL: ?
      }).then(() => {
        console.log("SignUp Successful!");
        this.props.navigation.navigate('Main');
      }, (error) => {
        console.log(error.message);
      });
    }, (error) => {
      Alert.alert(error.message);
    });
  };

  _backToSignIn = () => {
    this.props.navigation.goBack();
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  wrapper: {
    paddingVertical: 20,
  },
  inputContainerStyle: {
    margin: 8,
  },
  cardButton: {
    marginTop: 10,
  },
});

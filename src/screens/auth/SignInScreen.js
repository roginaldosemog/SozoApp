import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert
} from 'react-native';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import * as firebase from 'firebase';

export default class SignInScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    email: '',
    password: '',
  };

  render() {
    return (
      <View style={{paddingTop:50, alignItems:"center"}}>

        <Text>Login</Text>

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

        <Button title="Login" onPress={this._signInAsync} />
        <Button title="Create account..." onPress={this._goToSignUp} />
        <Button title="Forgot Password..." onPress={this._forgotPassword} />
      </View>
    );
  }

  _signInAsync = async () => {
    await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(() => {
      console.log("SignIn Sucessful!");
      this.props.navigation.navigate('Main');
    }, (error) => {
      Alert.alert(error.message);
    });
  };

  _goToSignUp = () => {
    this.props.navigation.navigate('SignUp');
  };

  _forgotPassword = () => {
    this.props.navigation.navigate('ForgotPassword');
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

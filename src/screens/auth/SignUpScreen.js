import React from 'react';
// import { StyleSheet, View, Text } from 'react-native';
// import { Card, Button, TextInput, HelperText } from 'react-native-paper';
import { RadioButton, Paragraph } from 'react-native-paper';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import * as firebase from 'firebase';
import moment from 'moment';

export default class SignUpScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    team: 'none',
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

        <Text>Qual a sua equipe?</Text>

        <RadioButton.Group
          value={this.state.team}
          onValueChange={(team) => { this.setState({team: team}) }} >
          <View style={styles.row}>
            <Paragraph>Nenhuma</Paragraph>
            <RadioButton value='none' />
          </View>
          <View style={styles.row}>
            <Paragraph>BIC (Meninos)</Paragraph>
            <RadioButton value='bic' />
          </View>
          <View style={styles.row}>
            <Paragraph>JFG (Meninas)</Paragraph>
            <RadioButton value='jfg' />
          </View>
        </RadioButton.Group>
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
        <View style={{paddingTop:10}} />

        <Button title="Signup" onPress={this.signUpAsync} />

        <Button title="Back to Login" onPress={this.backToSignIn} />
      </View>
    );
  }

  backToSignIn = () => {
    this.props.navigation.goBack();
  };

  signUpAsync = async () => {
    if (this.state.password != this.state.passwordConfirm) {
      Alert.alert("Passwords do not match");
      return;
    }

    if (this.state.name.length < 5) {
      Alert.alert("Name is too short");
      return;
    }

    await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then(() => {
      var user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: this.state.name,
        // photoURL: ?
      }).then(async () => {
        await this.storeUserData();
        this.props.navigation.navigate('Main');
      }, (error) => {
        console.log(error.message);
      });
    }, (error) => {
      Alert.alert(error.message);
    });
  };

  storeUserData = async () => {
    const userId = firebase.auth().currentUser.uid;
    const yesterday = moment().subtract(1, 'day');
    const yesterdayDate = [
      yesterday.get('year'), yesterday.get('month'), yesterday.get('date')
    ];

    await firebase.database().ref('users/' + userId).set({
      correctRecord: 0,
      correctStreak: 0,
      lastAnswerDate: yesterdayDate,
      lastAnswerWasCorrect: false,
      score: 0,
      team: this.state.team,
    })
    .then(() => {console.log("SignUp Successful!")})
    .catch((error) => {console.log(error)})
  }
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

import React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import * as firebase from 'firebase';

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    headerTitle: 'Profile',
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Perfil',
    };
  };

  state = {
    name: null,
    score: null,
    admin: null,
  };

  componentDidMount() {
    this.getUserData();
    this.fetchUserData();
  }

  getUserData = () => {
    var user = firebase.auth().currentUser;
    var name;

    if (user != null) {
      name = user.displayName;
    }

    this.setUserName(name);
  }

  setUserName = (name) => {
    this.setState(prevState => ({
      name: name,
    }));
  }

  setUserScore = (score) => {
    this.setState(prevState => ({
      score: score,
    }));
  }

  setUserAdmin = (admin) => {
    this.setState(prevState => ({
      admin: admin,
    }));
  }

  fetchUserData = async () => {
    var userId = firebase.auth().currentUser.uid;
    await firebase.database().ref('users/' + userId).on('value', (snapshot) => {
      if (!snapshot.val()) {
        console.log('Error getting user data');
      }
      else {
        const score = snapshot.val().score;
        const admin = snapshot.val().isAdmin;
        this.setUserScore(score);
        this.setUserAdmin(admin);
      }
    });
  }

  signOutAsync = async () => {
    await firebase.auth().signOut()
    .then(() => {
      console.log("SignOut Sucessful!");
      this.props.navigation.navigate('Auth');
    }, (error) => {
      Alert.alert(error.message);
    });
  };

  renderCreateQuestionIfAdmin = () => {
    if (this.state.admin) {
      return (
        <Button
          title="Criar Pergunta"
          onPress={() => this.props.navigation.navigate('CreateQuestion')}
        />
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text>{this.state.name}</Text>
          <Text>Pontos: {this.state.score}</Text>
        </View>
        <Button title="Sign out" onPress={this.signOutAsync} />
        <View style={{paddingTop:10}} />
        {this.renderCreateQuestionIfAdmin()}
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

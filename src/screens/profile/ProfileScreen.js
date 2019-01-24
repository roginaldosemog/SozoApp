import React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import * as firebase from 'firebase';

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    headerTitle: 'Profile',
  };

  state = {
    name: null,
  };

  componentDidMount() {
    this.getUserData();
  }

  getUserData = () => {
    var user = firebase.auth().currentUser;
    var name;

    if (user != null) {
      name = user.displayName;
    }

    this.setState(prevState => ({
      name: name,
    }));
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

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text>
            {this.state.name}
          </Text>
        </View>
        <Button title="Sign me out :)" onPress={this.signOutAsync} />
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

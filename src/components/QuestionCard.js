import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Button } from 'react-native-paper';

import * as firebase from 'firebase';
import moment from 'moment';

export default class QuestionCard extends React.Component {
  state = {
    questionMode: null,
    answeredToday: null,
    lastAnswerWasCorrect: null,

    teste: null,
  }

  componentWillMount() {
    var userId = firebase.auth().currentUser.uid;
    this.fetchTeste(userId);
  }

  storeTeste(userId, value) {
    firebase.database().ref('users/' + userId).set({
      teste: value,
    })
    .then(() => {console.log('Success at storeTeste')})
    .catch((error) => {console.log(error)})
  }

  fetchTeste(userId) {
    firebase.database().ref('users/' + userId).on('value', (snapshot) => {
      // If user data does not exist, it'll be created
      if (!snapshot.val()) {
        this.storeTeste(userId, 100)
      }
      else {
        const teste = snapshot.val().teste;
        console.log("teste: " + teste);
        this.setTesteState(teste);
      }
    });
  }

  setTesteState = value => {
    this.setState((prevState) => {
      return {teste: value}
    })
  }

  render() {
    console.log("render is here! And test value is: " + this.state.teste);
    return (
      <Card style={styles.card}>
        {/*this.loadQuestionCard()*/}
        <Text> {this.state.teste} </Text>
      </Card>
    );
  }

  // _loadQuestionMode() {
  //   this._getUserData(); //await?
  //
  //   const answeredToday = this.state.answeredToday;
  //   const lastAnswerWasCorrect = this.state.lastAnswerWasCorrect;
  //   var mode;
  //
  //   if (answeredToday){
  //     if (lastAnswerWasCorrect)
  //     mode = 1;
  //     else
  //     mode = 2;
  //   } else {
  //     mode = 0;
  //     // Load Daily Question
  //   }
  //   this._setQuestionMode(mode); //await?
  // }

  // _getUserData() {
  //   var dateX, lastX, scoreX;
  //
  //
  //   var userId = firebase.auth().currentUser.uid;
  //   firebase.database().ref('users/' + userId).on('value', (snapshot) => {});


  // console.log(!snapshot);
  // console.log(!!snapshot);
  // console.log(snapshot === null);
  // console.log(snapshot);
  //
  //
  // if (!!snapshot) {
  //   console.log(snapshot.val().lastAnswerDate);
  //   console.log(snapshot.val().lastAnswerWasCorrect);
  //
  //   if (!!snapshot.val().lastAnswerDate && !!snapshot.val().lastAnswerWasCorrect) {
  //     const lastAnswerDate = snapshot.val().lastAnswerDate;
  //     const lastAnswerWasCorrect = snapshot.val().lastAnswerWasCorrect;
  //
  //     console.log(lastAnswerDate);
  //     console.log("lastAnswerWasCorrect: " + lastAnswerWasCorrect);
  //
  //     this._setAnsweredToday(lastAnswerDate);
  //     this.setState({lastAnswerWasCorrect: lastAnswerWasCorrect})
  //   }
  // } else {
  //   console.log("No user data");
  //   this._createUserData();
  // }

  // .then((snapshot) => {
  //   console.log(snapshot);
  //   return snapshot;
  // }, (error) => {
  //   console.log(error.message);
  // });
  // }

  // _setAnsweredToday(lastAnswerDate) {
  //   var today = moment();
  //   // var today = moment([2019, 0, 20]);
  //   var lastAnswer = moment(lastAnswerDate);
  //   var daysFromLastAnswer = today.diff(lastAnswer, 'days');
  //   console.log(daysFromLastAnswer);
  //
  //   var answeredToday = daysFromLastAnswer == 0 ? true : false;
  //   console.log(answeredToday);
  // }
  //
  // _createUserData() {
  //   var userId = firebase.auth().currentUser.uid;
  //   firebase.database().ref('users/' + userId).set({
  //     lastAnswerDate: [2019, 0, 20],
  //     lastAnswerWasCorrect: false,
  //     score: 0,
  //   })
  //   .then((data) => {
  //     console.log('success at creation of user data', data)
  //   })
  //   .catch((error) => {
  //     console.log('error at creation of user data', error)
  //   })
  // }

  ///////// ALL RIGHT /////////

  loadQuestionCard() {
    // 0 = Not answered
    // 1 = Correct answer
    // 2 = Wrong answer
    // 3 = Answering

    switch (this.state.questionMode) {
      case 0:
      return (
        <Card.Content style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            PERGUNTA DO DIA
          </Text>
          <Text style={styles.cardParagraph}>
            Não respondida.
          </Text>
          <Button
            style={styles.cardButton}
            mode="contained"
            color="#004488"
            onPress={() => this.onCardButtonPress(3)}>
            RESPONDER!
          </Button>
        </Card.Content>
      );
      break;
      case 1:
      return (
        <Card.Content style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            PERGUNTA DO DIA
          </Text>
          <Text style={styles.cardParagraph}>
            Resposta certa.
          </Text>
          <Button style={styles.cardButton}
            mode="contained"
            color="#004488"
            onPress={() => this.onCardButtonPress(0)}>
            RESETAR!
          </Button>
        </Card.Content>
      );
      break;
      case 2:
      return (
        <Card.Content style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            PERGUNTA DO DIA
          </Text>
          <Text style={styles.cardParagraph}>
            Resposta errada.
          </Text>
          <Button style={styles.cardButton}
            mode="contained"
            color="#004488"
            onPress={() => this.onCardButtonPress(0)}>
            RESETAR!
          </Button>
        </Card.Content>
      );
      break;
      case 3:
      return (
        <Card.Content style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            PERGUNTA DO DIA
          </Text>
          <Text style={styles.cardParagraph}>
            Respondendo.
          </Text>
          <View>
            <Button style={styles.cardButton}
              mode="contained"
              color="#004488"
              onPress={() => this.onCardButtonPress(1)}>
              RESPOSTA CERTA
            </Button>
            <Button style={styles.cardButton}
              mode="contained"
              color="#004488"
              onPress={() => this.onCardButtonPress(2)}>
              RESPOSTA ERRADA
            </Button>
          </View>
        </Card.Content>
      );
      break;
      default:
      // Something is wrong
      // Loading
      // console.log("Error loading question mode"); // Fix
      break;
    }
  }

  onCardButtonPress = mode => {
    //console.log('Pressed Daily Question Card Button');
    this.setQuestionMode(mode);
  }

  // answeredToday: null,
  // lastAnswerWasCorrect: null,

  setQuestionMode = mode => {
    this.setState((prevState) => {
      return {questionMode: mode}
    })
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 4,
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '500',
  },
  cardParagraph: {
    //
  },
  cardButton: {
    marginTop: 10,
  },
});

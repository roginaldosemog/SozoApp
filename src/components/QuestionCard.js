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
    score: null,
  }

  componentWillMount() {
    var userId = firebase.auth().currentUser.uid;
    this.fetchUserData(userId);
  }

  storeUserData(userId) {
    firebase.database().ref('users/' + userId).set({
      lastAnswerDate: [2019, 0, 20], //trocar por 'ontem'
      lastAnswerWasCorrect: false,
      score: 0,
    })
    .then(() => {console.log('Success at storeTeste')})
    .catch((error) => {console.log(error)})
  }

  fetchUserData(userId) {
    firebase.database().ref('users/' + userId).on('value', (snapshot) => {
      // If user data does not exist, it'll be created
      if (!snapshot.val()) {
        this.storeUserData(userId)
      }
      else {
        const lastAnswerDate = snapshot.val().lastAnswerDate;
        this.setAnsweredTodayFromDate(lastAnswerDate);

        const lastAnswerWasCorrect = snapshot.val().lastAnswerWasCorrect;
        this.setLastAnswerWasCorrect(lastAnswerWasCorrect);

        const score = snapshot.val().score;
        this.setScore(score);

        this.updateQuestionMode();
      }
    });
  }

  updateQuestionMode = () => {
    const answeredToday = this.state.answeredToday;
    const lastAnswerWasCorrect = this.state.lastAnswerWasCorrect;

    if (answeredToday){
      if (lastAnswerWasCorrect)
      this.setQuestionMode(1);
      else
      this.setQuestionMode(2);
    } else {
      this.setQuestionMode(0);
    }
  }

  setAnsweredTodayFromDate = lastAnswerDate => {
    var today = moment();
    var lastAnswer = moment(lastAnswerDate);
    var daysFromLastAnswer = today.diff(lastAnswer, 'days');
    console.log("f: daysFromLastAnswer: " + daysFromLastAnswer);

    var answeredToday = daysFromLastAnswer == 0 ? true : false;
    console.log("f: answeredToday: " + answeredToday);

    this.setState((prevState) => {
      return {answeredToday: answeredToday}
    })
  }

  setLastAnswerWasCorrect = lastAnswerWasCorrect => {
    this.setState((prevState) => {
      return {lastAnswerWasCorrect: lastAnswerWasCorrect}
    })
  }

  setScore = score => {
    this.setState((prevState) => {
      return {score: score}
    })
  }

  setQuestionMode = questionMode => {
    this.setState((prevState) => {
      return {questionMode: questionMode}
    })
  }

  render() {
    console.log("render is here! And mode value is: " + this.state.questionMode);
    return (
      <Card style={styles.card}>
        {this.loadQuestionCard()}
      </Card>
    );
  }

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

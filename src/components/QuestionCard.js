import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Button } from 'react-native-paper';
import CountDown from 'react-native-countdown-component';

import * as firebase from 'firebase';
import moment from 'moment';

export default class QuestionCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      questionMode: null,
      answeredToday: null,
      lastAnswerWasCorrect: null,
      score: null,
    }

    this.userId = firebase.auth().currentUser.uid;
  }

  componentDidMount() {
    this.fetchUserData();
  }

  fetchUserData = async () => {
    await firebase.database().ref('users/' + this.userId).on('value', (snapshot) => {
      // If user data does not exist, it'll be created
      if (!snapshot.val()) {
        this.storeUserData()
      }
      else {
        const lastAnswerDate = snapshot.val().lastAnswerDate;
        const lastAnswerWasCorrect = snapshot.val().lastAnswerWasCorrect;
        const score = snapshot.val().score;

        this.setUserDataStates(lastAnswerDate, lastAnswerWasCorrect, score);
      }
    });
  }

  storeUserData = async () => {
    const yesterday = moment().subtract(1, 'day');
    const yesterdayDate = [
      yesterday.get('year'), yesterday.get('month'), yesterday.get('date')
    ];

    await firebase.database().ref('users/' + this.userId).set({
      lastAnswerDate: yesterdayDate,
      lastAnswerWasCorrect: false,
      score: 0,
    })
    .then(() => {console.log('Success at storeUserData')})
    .catch((error) => {console.log(error)})
  }

  updateUserData = async (answeredCorrect) => {
    const today = moment();
    const todayDate = [
      today.get('year'), today.get('month'), today.get('date')
    ];
    const pointsToAdd = 50;
    const newScore = answeredCorrect ? this.state.score + pointsToAdd : this.state.score;

    await firebase.database().ref('users/' + this.userId).set({
      lastAnswerDate: todayDate,
      lastAnswerWasCorrect: answeredCorrect,
      score: newScore,
    })
    .then(() => {console.log('Success at updateUserData')})
    .catch((error) => {console.log(error)})
  }

  setUserDataStates = (lastAnswerDate, lastAnswerWasCorrect, score) => {
    var today = moment();
    var lastAnswer = moment(lastAnswerDate);
    var daysFromLastAnswer = today.diff(lastAnswer, 'days');
    var answeredToday = daysFromLastAnswer == 0 ? true : false;

    this.setState(prevState => ({
      answeredToday: answeredToday,
      lastAnswerWasCorrect: lastAnswerWasCorrect,
      score: score
    }), () => {
      this.updateQuestionMode();
    });
  }

  updateQuestionMode = () => {
    const answeredToday = this.state.answeredToday;
    const lastAnswerWasCorrect = this.state.lastAnswerWasCorrect;

    if (answeredToday) {
      if (lastAnswerWasCorrect)
      this.setQuestionMode(1);
      else
      this.setQuestionMode(2);
    } else {
      this.setQuestionMode(0);
    }
  }

  setQuestionMode = questionMode => {
    this.setState((prevState) => {
      return {questionMode: questionMode}
    })
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
          <View>
            <Text style={styles.cardTitle}>
              PERGUNTA DO DIA
            </Text>
            <CountDown
              until={10}
              size={15}
              onFinish={() => this.onCardButtonPress(2)}
              digitStyle={{backgroundColor: '#1CC625'}}
              digitTxtStyle={{color: '#FFF'}}
              timeToShow={['S']}
              timeLabels={{s: ''}}
            />
          </View>
          <View>
            <Text style={styles.cardParagraph}>
              Respondendo.
            </Text>
          </View>
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
      // Loading...
      console.log("questionMode is null!");
      break;
    }
  }

  onCardButtonPress = mode => {
    console.log("clicked to mode: " + mode);
    var answeredCorrect = null;
    switch (mode) {
      case 0:
      // RESETAR
      console.log("Reset mannualy at firebase database");
      break;
      case 1:
      // RESPOSTA CERTA
      answeredCorrect = true;
      this.updateUserData(answeredCorrect);
      break;
      case 2:
      // RESPOSTA ERRADA
      answeredCorrect = false;
      this.updateUserData(answeredCorrect);
      break;
      case 3:
      // RESPONDER
      // Check date
      this.setQuestionMode(3); // temporary // Fix
      break;
      default:
      console.log("Error at onCardButtonPress");
      break;
    }
  }

  render() {
    return (
      <Card style={styles.card}>
        {this.loadQuestionCard()}
      </Card>
    );
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

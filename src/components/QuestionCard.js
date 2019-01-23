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
      userAnsweredToday: null,
      lastAnswerWasCorrect: null,
      score: null,
      dailyQuestion: null
    }

    this.userId = firebase.auth().currentUser.uid;
  }

  componentDidMount() {
    this.fetchUserData();
  }

  fetchUserData = async () => {
    await firebase.database().ref('users/' + this.userId).on('value', (snapshot) => {
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
    var userAnsweredToday = daysFromLastAnswer == 0 ? true : false;

    this.setState(prevState => ({
      userAnsweredToday: userAnsweredToday,
      lastAnswerWasCorrect: lastAnswerWasCorrect,
      score: score
    }), () => {
      this.updateQuestionMode();
    });
  }

  updateQuestionMode = () => {
    const userAnsweredToday = this.state.userAnsweredToday;
    const lastAnswerWasCorrect = this.state.lastAnswerWasCorrect;

    if (userAnsweredToday) {
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

  answerQuestion = async () => {
    var dailyQuestion = await this.fetchQuestionData();
    this.setState(prevState => ({
      dailyQuestion: dailyQuestion,
    }), () => {
      this.setQuestionMode(3);
    });
    console.log(this.state.dailyQuestion);
  }

  fetchQuestionData = async () => {
    var today = moment().format('YYYYMMDD');
    var answeredToday = await this.getAnsweredToday(today);
    var dailyQuestions = await this.getDailyQuestionsCount(today);
    if (dailyQuestions == 0) {
      console.log("No questions for today!");
      // TODO: novo modo = no questions for today.
      return;
    }

    var questionToBeChoosen = answeredToday % dailyQuestions;
    console.log("choose: " + questionToBeChoosen);
    var dailyQuestion;
    await firebase.database().ref('questions/' + today + '/' + questionToBeChoosen)
    .once('value', (snapshot) => {
      dailyQuestion = snapshot.val();
      console.log(snapshot.val());
    });
    return dailyQuestion;
  }

  setAnsweredToday = async (date, value) => {
    await firebase.database().ref('questions/answersCount/' + date).set({
      answeredToday: value,
    })
    .then(() => {console.log('Success at setAnsweredToday')})
    .catch((error) => {console.log(error)})
  }

  getAnsweredToday = async (date) => {
    var answeredToday;
    await firebase.database().ref('questions/answersCount/' + date).once('value', (snapshot) => {
      if (!snapshot.val()) {
        answeredToday = 0;
        this.setAnsweredToday(date, answeredToday);
      } else {
        answeredToday = snapshot.val().answeredToday;
      }
    });
    return answeredToday;
  }

  getDailyQuestionsCount = async (date) => {
    var questionsCount;
    await firebase.database().ref('questions/' + date).once('value', (snapshot) => {
      questionsCount = snapshot.numChildren();
    });
    return questionsCount;
  }

  // TODO: Uma das abas vai ter de ser para cadastrar as questões
  storeQuestionData = async () => {
    // receive questionData
    var questionData = {
      date: '20190123',
      data: {
        chapter: 'Mateus 2',
        statement: 'De que lugar uns magos vieram à procura de Jesus?',
        optionA: 'Das terras do Sul',
        optionB: 'Das terras do Norte',
        optionC: 'Das terras do Oriente',
        optionD: 'Das terras do Ocidente',
        correctOption: 3,
      }
    }

    var questionId = await this.getDailyQuestionsCount(questionData.date);
    await firebase.database().ref('questions/' + questionData.date).child(questionId)
    .set(questionData.data)
    .then(() => {console.log('Success at storeQuestionData')})
    .catch((error) => {console.log(error)})
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
      // console.log("questionMode is null!");
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
      this.answerQuestion();
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

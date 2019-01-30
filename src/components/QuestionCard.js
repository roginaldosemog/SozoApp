import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Card, Button } from 'react-native-paper';
import CountDown from 'react-native-countdown-component';
import * as firebase from 'firebase';
import moment from 'moment';

import { MontText, MontBoldText, MontSemiboldText } from './StyledText';
import PlanDates from '../constants/PlanDates';

export default class QuestionCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      questionMode: 0,
      userAnsweredToday: null,
      lastAnswerWasCorrect: null,
      score: null,
      dailyQuestion: null,
      initialPlanDate: null,
      actualPlanDate: null,
      actualPlanChapter: null,
      planDates: PlanDates.planDates,
      correctStreak: null,
      correctRecord: null,
      isClicked: false,
    }

    this.userId = firebase.auth().currentUser.uid;
  }

  componentDidMount() {
    this.getPlanDates();
    this.fetchUserData();
  }

  getPlanDates = async () => {
    var initialPlanDate, actualPlanChapter;

    await firebase.database().ref('questions/').once('value', (snapshot) => {
      initialPlanDate = snapshot.val().initialDate;
    });

    var today = moment();
    var initial = moment(initialPlanDate.toString());
    var actualPlanDate = today.diff(initial, 'days');
    actualPlanChapter = this.state.planDates[actualPlanDate].title;

    actualPlanDate++;
    actualPlanDate = ("0" + actualPlanDate).slice(-2);

    this.setState(prevState => ({
      initialPlanDate: initialPlanDate,
      actualPlanDate: actualPlanDate,
      actualPlanChapter: actualPlanChapter
    }));
  }

  fetchUserData = async () => {
    await firebase.database().ref('users/' + this.userId).on('value', (snapshot) => {
      if (!snapshot.val()) {
        // this.storeUserData();
        console.log("Error fetching user data")
      }
      else {
        const lastAnswerDate = snapshot.val().lastAnswerDate;
        const lastAnswerWasCorrect = snapshot.val().lastAnswerWasCorrect;
        const score = snapshot.val().score;
        const correctStreak = snapshot.val().correctStreak;
        const correctRecord = snapshot.val().correctRecord;

        this.setUserDataStates(lastAnswerDate, lastAnswerWasCorrect, score, correctStreak, correctRecord);
      }
    });
  }

  updateUserData = async (answeredCorrect) => {
    const today = moment();
    const todayDate = [
      today.get('year'), today.get('month'), today.get('date')
    ];
    const pointsToAdd = 10;
    const newScore = answeredCorrect ? this.state.score + pointsToAdd : this.state.score;

    const correctStreak = answeredCorrect ? this.state.correctStreak + 1 : 0;
    const correctRecord = correctStreak > this.state.correctRecord ?
    correctStreak : this.state.correctRecord;

    var answeredToday = await this.getAnsweredToday(today.format('YYYYMMDD'));
    await this.setAnsweredToday(today.format('YYYYMMDD'), ++answeredToday);

    await firebase.database().ref('users/' + this.userId).update({
      lastAnswerDate: todayDate,
      lastAnswerWasCorrect: answeredCorrect,
      score: newScore,
      correctStreak: correctStreak,
      correctRecord: correctRecord,
    })
    .then(() => {
      console.log('Success at updateUserData');
      this.setState(prevState => ({
        isClicked: false,
      }));
    })
    .catch((error) => {console.log(error)})
  }

  setUserDataStates = async (lastAnswerDate, lastAnswerWasCorrect, score, correctStreak, correctRecord) => {
    var today = moment();
    var lastAnswer = moment(lastAnswerDate);
    var daysFromLastAnswer = today.diff(lastAnswer, 'days');

    var userAnsweredToday = daysFromLastAnswer == 0 ? true : false;
    var newCorrectStreak = daysFromLastAnswer > 1 ? 0 : correctStreak;

    this.setState(prevState => ({
      userAnsweredToday: userAnsweredToday,
      lastAnswerWasCorrect: lastAnswerWasCorrect,
      score: score,
      correctStreak: newCorrectStreak,
      correctRecord: correctRecord,
    }), () => {
      this.updateQuestionMode();
    });
  }

  updateQuestionMode = () => {
    const userAnsweredToday = this.state.userAnsweredToday;
    const lastAnswerWasCorrect = this.state.lastAnswerWasCorrect;

    if (userAnsweredToday) {
      if (lastAnswerWasCorrect)
      this.setQuestionMode(3);
      else
      this.setQuestionMode(4);
    } else {
      this.setQuestionMode(1);
    }
  }

  setQuestionMode = questionMode => {
    this.setState((prevState) => {
      return {questionMode: questionMode}
    })
  }

  makeQuestion = async () => {
    var dailyQuestion = await this.fetchQuestionData();
    if (!dailyQuestion) {
      this.setQuestionMode(5);
    } else {
      this.setState(prevState => ({
        dailyQuestion: dailyQuestion,
      }), () => {
        this.setQuestionMode(2);
      });
    }
  }

  fetchQuestionData = async () => {
    var today = moment();
    var actualPlanDate = this.state.actualPlanDate;

    var answeredToday = await this.getAnsweredToday(today.format('YYYYMMDD'));
    var dailyQuestions = await this.getDailyQuestionsCount(actualPlanDate);
    if (dailyQuestions == 0) {
      console.log("No questions for today!");
      return null;
    }

    var questionToBeChoosen = answeredToday % dailyQuestions;
    var dailyQuestion;
    await firebase.database().ref('questions/' + actualPlanDate + '/' + questionToBeChoosen)
    .once('value', (snapshot) => {
      dailyQuestion = snapshot.val();
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

  loadQuestionCard() {
    // 0 = Loading
    // 1 = Not answered
    // 2 = Answering
    // 3 = Right answer
    // 4 = Wrong answer
    // 5 = No questions

    switch (this.state.questionMode) {
      case 0:
      return (
        <View style={styles.cardContent}>
          <ActivityIndicator />
        </View>
      );
      break;
      case 1:
      return (
        <View style={styles.cardContent}>
          <View>
            <MontBoldText style={styles.cardTitle}>
              PERGUNTA DO DIA
            </MontBoldText>
            <MontBoldText style={styles.cardTitle}>
              {this.state.actualPlanChapter}
            </MontBoldText>
          </View>
          <View>
            <MontSemiboldText style={styles.cardParagraph}>
              Não respondida.
            </MontSemiboldText>
          </View>
          <View>
            <Button
              style={styles.cardButton}
              mode="contained"
              color="#004488"
              onPress={() => this.makeQuestion()}>
              RESPONDER!
            </Button>
          </View>
        </View>
      );
      break;
      case 2:
      return (
        <View style={styles.cardContent}>
          <View>
            <MontBoldText style={styles.cardTitle}>
              PERGUNTA DO DIA
            </MontBoldText>
            <MontBoldText style={styles.cardTitle}>
              {this.state.actualPlanChapter}
            </MontBoldText>
            <CountDown
              until={10}
              size={15}
              onFinish={() => this.answerQuestion(0)}
              digitStyle={{backgroundColor: '#1CC625'}}
              digitTxtStyle={{color: '#FFF'}}
              timeToShow={['S']}
              timeLabels={{s: ''}}
            />
          </View>
          <View>
            <MontSemiboldText style={styles.cardParagraph}>
              {this.state.dailyQuestion.statement}
            </MontSemiboldText>
          </View>
          <View>
            <Button style={styles.cardButton}
              mode="contained"
              color="#004488"
              onPress={() => this.answerQuestion(1)}>
              {this.state.dailyQuestion.optionA}
            </Button>
            <Button style={styles.cardButton}
              mode="contained"
              color="#004488"
              onPress={() => this.answerQuestion(2)}>
              {this.state.dailyQuestion.optionB}
            </Button>
            <Button style={styles.cardButton}
              mode="contained"
              color="#004488"
              onPress={() => this.answerQuestion(3)}>
              {this.state.dailyQuestion.optionC}
            </Button>
            <Button style={styles.cardButton}
              mode="contained"
              color="#004488"
              onPress={() => this.answerQuestion(4)}>
              {this.state.dailyQuestion.optionD}
            </Button>
          </View>
        </View>
      );
      break;
      case 3:
      return (
        <View style={styles.cardContent}>
          <View>
            <MontBoldText style={styles.cardTitle}>
              PERGUNTA DO DIA
            </MontBoldText>
            <MontBoldText style={styles.cardTitle}>
              {this.state.actualPlanChapter}
            </MontBoldText>
          </View>
          <View>
            <MontSemiboldText style={styles.cardParagraph}>
              Você acertou a pergunta de hoje :)
            </MontSemiboldText>
            <MontSemiboldText style={styles.cardParagraph}>
              Volte amanhã pra ganhar mais pontos!
            </MontSemiboldText>
          </View>
          <View>
          </View>
        </View>
      );
      break;
      case 4:
      return (
        <View style={styles.cardContent}>
          <View>
            <MontBoldText style={styles.cardTitle}>
              PERGUNTA DO DIA
            </MontBoldText>
            <MontBoldText style={styles.cardTitle}>
              {this.state.actualPlanChapter}
            </MontBoldText>
          </View>
          <View>
            <MontSemiboldText style={styles.cardParagraph}>
              Você errou a pergunta de hoje :/
            </MontSemiboldText>
            <MontSemiboldText style={styles.cardParagraph}>
              Tente novamente amanhã, e não fique pra trás!
            </MontSemiboldText>
          </View>
          <View>
          </View>
        </View>
      );
      break;
      case 5:
      return (
        <View style={styles.cardContent}>
          <View>
            <MontBoldText style={styles.cardTitle}>
              PERGUNTA DO DIA
            </MontBoldText>
            <MontBoldText style={styles.cardTitle}>
              {this.state.actualPlanChapter}
            </MontBoldText>
          </View>
          <View>
            <MontSemiboldText style={styles.cardParagraph}>
              Hoje não tem pergunta!
            </MontSemiboldText>
          </View>
          <View>
          </View>
        </View>
      );
      break;
      default:
      console.log("Error at questionMode!");
      break;
    }
  }

  answerQuestion = answer => {
    if (!this.state.isClicked) {
      var answeredCorrect = null;
      this.setState(prevState => ({
        isClicked: true,
      }), () => {
        if (answer == this.state.dailyQuestion.correctOption) {
          console.log("Acertou miseravel");
          answeredCorrect = true;
        } else {
          console.log("Hoje não!");
          answeredCorrect = false;
        }
        this.updateUserData(answeredCorrect);
      });
    }
  }

  render() {
    return (
      <View style={styles.card}>
        {this.loadQuestionCard()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 4,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 6,
    backgroundColor: '#fdfdfd',
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 26,
  },
  cardParagraph: {
    fontSize: 18,
  },
  cardButton: {
    marginTop: 10,
  },
});

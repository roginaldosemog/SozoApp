import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,

  ActivityIndicator,
  AsyncStorage,
  //Button,
  StatusBar,
} from 'react-native';
import {
  Title,
  Caption,
  Paragraph,
  Card,
  Button
} from 'react-native-paper';
import { WebBrowser } from 'expo';
import * as firebase from 'firebase';
import moment from 'moment';

export default class QuestionCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      questionMode: null,
      wasLastAnswerCorrect: null,
      answeredToday: null,

      score: null,
    }
  }

  componentWillMount() {
    this._loadQuestionMode();
  }

  render() {
    return (
      <Card style={styles.card}>
        {this._loadQuestionCard()}
      </Card>
    );
  }

  _onCardButtonPress = (mode) => {
    console.log('Pressed Daily Question Card Button');
    this._setQuestionMode(mode);
  }

  _loadQuestionMode = async () => {
    this._getUserData();

    //const answeredToday = this.state.answeredToday;
    const wasLastAnswerCorrect = this.state.wasLastAnswerCorrect;


    var today = moment();
    var lastAnswer = moment([2019, 0, 20]); // Get date from firebase
    var daysFromLastAnswer = today.diff(lastAnswer, 'days');

    var answeredToday = daysFromLastAnswer == 0 ? true : false;
    await this.setState({answeredToday: answeredToday});

    // Get if last answer was correct or not (firebase)


    var mode;

    if (answeredToday){
      if (wasLastAnswerCorrect)
      mode = 1;
      else
      mode = 2;
    } else {
      mode = 0;
      // Load Daily Question
    }

    await this._setQuestionMode(mode);
  }

  _getUserData = () => {
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('users/' + userId).on('value', (snapshot) => {
      if (snapshot.val().lastAnswerDate != null){
        const lastAnswerDate = snapshot.val().lastAnswerDate;
        console.log("lastAnswerDate: " + lastAnswerDate.year);
      }
      if (snapshot.val().wasLastAnswerCorrect != null){
        const wasLastAnswerCorrect = snapshot.val().wasLastAnswerCorrect;
        console.log("wasLastAnswerCorrect: " + wasLastAnswerCorrect);
      }
    });
    // .then((snapshot) => {
    //   console.log(snapshot);
    //   return snapshot;
    // }, (error) => {
    //   console.log(error.message);
    // });
  }

  _loadQuestionCard = () => {
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
            onPress={() => this._onCardButtonPress(3)}>
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
            onPress={() => this._onCardButtonPress(0)}>
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
            onPress={() => this._onCardButtonPress(0)}>
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
              onPress={() => this._onCardButtonPress(1)}>
              RESPOSTA CERTA
            </Button>
            <Button style={styles.cardButton}
              mode="contained"
              color="#004488"
              onPress={() => this._onCardButtonPress(2)}>
              RESPOSTA ERRADA
            </Button>
          </View>
        </Card.Content>
      );
      break;
      default:
      // Something is wrong
      // console.log("Error loading question mode"); // Fix
      break;
    }
  }

  _setQuestionMode = mode => {
    this.setState({questionMode: mode});
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

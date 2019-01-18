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

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };

  state = {
    questionMode: 0
  };

  componentDidMount() {
    // Load question status
  }

  render() {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              PERGUNTA DO DIA
            </Text>
            {this._loadQuestionMode()}
            <Button
              style={styles.cardButton}
              mode="contained"
              color="#004488"
              onPress={() => console.log('Pressed Challenge Card Button')}
              >
                RESPONDER!
              </Button>
            </Card.Content>
          </Card>
        </View>
      );
    }

    _loadQuestionMode() {
      // 0 = Not answered
      // 1 = Correct answer
      // 2 = Wrong answer
      // 3 = Answering

      switch (this.state.questionMode) {
        case 0:
        return (
          <Text style={styles.cardParagraph}>
            Não respondida.
          </Text>
        );
        break;
        case 1:
        return (
          <Text style={styles.cardParagraph}>
            Resposta certa.
          </Text>
        );
        break;
        case 2:
        return (
          <Text style={styles.cardParagraph}>
            Resposta errada.
          </Text>
        );
        break;
        case 3:
        return (
          <Text style={styles.cardParagraph}>
            Respondendo.
          </Text>
        );
        break;
        default:
        // Something is wrong
        console.log("Error loading question mode");
        break;
      }
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 4,
      backgroundColor: '#ddd'
    },
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

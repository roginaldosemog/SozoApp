import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert, Picker } from 'react-native';
import * as firebase from 'firebase';
import PlanDates from '../../constants/PlanDates';

const initialState = {
  date: '',
  chapter: '01',
  statement: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctOption: '',
  planDates: PlanDates.planDates,
};

export default class CreateQuestionScreen extends React.Component {
  static navigationOptions = {
    title: 'Cadastrar Pergunta',
  };

  state = initialState;

  storeQuestionData = async () => {
    var question = {
      date: this.state.date,
      data: {
        chapter: this.state.chapter,
        statement: this.state.statement,
        optionA: this.state.optionA,
        optionB: this.state.optionB,
        optionC: this.state.optionC,
        optionD: this.state.optionD,
        correctOption: this.state.correctOption,
      }
    }

    console.log(question.data.chapter);

    var questionId = await this.getDailyQuestionsCount(question.data.chapter);
    await firebase.database().ref('questions/' + question.data.chapter).child(questionId)
    .set(question.data)
    .then(() => {
      Alert.alert("Pergunta cadastrada!");
      this.setState(initialState);
    })
    .catch((error) => {console.log(error)})
  }

  getDailyQuestionsCount = async (date) => {
    var questionsCount;
    await firebase.database().ref('questions/' + date).once('value', (snapshot) => {
      questionsCount = snapshot.numChildren();
    });
    return questionsCount;
  }

  render() {
    const pickerItems = this.state.planDates.map(date => {
      return (
        <Picker.Item key={date.id} label={date.title} value={date.id} />
      )
    })

    return (
      <View style={{paddingTop:50, alignItems:"center"}}>

        <Text>Cadastrar Pergunta</Text>

        <TextInput style={{width: 200, height: 40, borderWidth: 1}}
          value={this.state.date}
          onChangeText={(date) => { this.setState({date: date}) }}
          placeholder="Data (YYYYMMDD)"
          autoCorrect={false}
        />
        <View style={{paddingTop:10}} />

        <Picker
          selectedValue={this.state.chapter}
          style={{ height: 50, width: 200 }}
          onValueChange={(itemValue, itemIndex) => this.setState({chapter: itemValue})}>
          {pickerItems}
        </Picker>
        <View style={{paddingTop:10}} />

        <TextInput style={{width: 200, height: 40, borderWidth: 1}}
          value={this.state.statement}
          onChangeText={(statement) => { this.setState({statement: statement}) }}
          placeholder="Enunciado"
          autoCorrect={false}
        />
        <View style={{paddingTop:10}} />

        <TextInput style={{width: 200, height: 40, borderWidth: 1}}
          value={this.state.optionA}
          onChangeText={(optionA) => { this.setState({optionA: optionA}) }}
          placeholder="Opção A"
          autoCorrect={false}
        />
        <View style={{paddingTop:10}} />

        <TextInput style={{width: 200, height: 40, borderWidth: 1}}
          value={this.state.optionB}
          onChangeText={(optionB) => { this.setState({optionB: optionB}) }}
          placeholder="Opção B"
          autoCorrect={false}
        />
        <View style={{paddingTop:10}} />

        <TextInput style={{width: 200, height: 40, borderWidth: 1}}
          value={this.state.optionC}
          onChangeText={(optionC) => { this.setState({optionC: optionC}) }}
          placeholder="Opção C"
          autoCorrect={false}
        />
        <View style={{paddingTop:10}} />

        <TextInput style={{width: 200, height: 40, borderWidth: 1}}
          value={this.state.optionD}
          onChangeText={(optionD) => { this.setState({optionD: optionD}) }}
          placeholder="Opção D"
          autoCorrect={false}
        />
        <View style={{paddingTop:10}} />

        <TextInput style={{width: 200, height: 40, borderWidth: 1}}
          value={this.state.correctOption}
          onChangeText={(correctOption) => { this.setState({correctOption: correctOption}) }}
          placeholder="Opção Correta (1 a 4)"
          autoCorrect={false}
        />
        <View style={{paddingTop:10}} />

        <Button title="Enviar Pergunta" onPress={() => this.storeQuestionData()} />

      </View>
    );
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
});

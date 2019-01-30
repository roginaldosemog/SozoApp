import React from 'react';
import { Text } from 'react-native';

class MontText extends React.Component {
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: 'montserrat' }]} />;
  }
}

class MontBoldText extends React.Component {
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: 'montserrat-bold' }]} />;
  }
}

class MontSemiboldText extends React.Component {
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: 'montserrat-semibold' }]} />;
  }
}

export { MontText, MontBoldText, MontSemiboldText };

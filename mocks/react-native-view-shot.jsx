import React from 'react';

class ViewShot extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.children;
  }

  capture() {
    return Promise.resolve('../assets/bootsplash_logo.png');
  }
}

export default ViewShot;
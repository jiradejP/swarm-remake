import React, { Component } from 'react';
import $ from 'jquery';

class ReplyImage extends Component {
  constructor() {
    super();
    this.state = {
      picture: 'https://cdn0.iconfinder.com/data/icons/user-pictures/100/maturewoman-3-128.png'
    }
  }
  componentWillReceiveProps(newProps) {
    const userEmail = newProps.email;
    const getPictureURL = `http://picasaweb.google.com/data/entry/api/user/${userEmail}?alt=json`;
    $.get(getPictureURL,
      data => {
        if (data.entry) {
          this.setState({ picture: data.entry.gphoto$thumbnail.$t });
        }
      },
    );
  }
  
  render() {
    return (
      <div>
        <img src={this.state.picture} alt="avatar" />        
      </div>
    );
  }
}

export default ReplyImage;
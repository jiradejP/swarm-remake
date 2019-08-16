import React, { Component } from 'react';
import ReplyImage from './ReplyImage';
class Replies extends Component {
    constructor() {
        super();
        this.state = {
            replies : []
        }
    }
    componentWillReceiveProps(newProps){
        this.setState(prevState => ({
            replies: this.props.replies,
        }), () => this.forceUpdate());
    }
    convertDate = (timestamp) => {
        let date = new Date(timestamp);
        date = date.toString();
        date = date.split(' ').splice(1, 4).join(' ');
        return date;
    }
    render() {
        let replies = [];
        for(let i in this.state.replies){
            replies.push(
                <div className="replies-reply" key={"replies-" + i}>
                    <div className="reply-user">
                        <ReplyImage email={this.state.replies[i].email}/>
                    </div>
                    <div className="reply-content">
                        <span className="reply-content-from">{this.state.replies[i].email}</span>
                        <span className="reply-content-replyDate">{ this.convertDate(this.state.replies[i].replyDate) }</span>
                        <br />
                        <span className="reply-content-content">{this.state.replies[i].content}</span>
                    </div>
                </div>
            )
        }
        return (
            <div className="replies">
                {replies}
            </div>
        );
    }
}

export default Replies;

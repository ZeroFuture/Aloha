import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { ChatFeed, Message } from 'react-chat-ui';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    chatBox: {
        height: "60vh",
        overflowY: "auto"
    },
}));

export default function ChatBox(props) {
    const classes = useStyles();
    const members = props.channel ? props.channel.members.map(member => member.username).join(', ') : [];
    var index = 1;
    const renderedMessages = props.channel ? props.channel.messages.map(message => {
        return new Message({id: index++, message: message.content, senderName: message.senderName});
    }) : [];
    console.log(props.channel);
    return (
        <Grid className={classes.chatBox}>
            <Grid item>
                <Typography variant="h6">
                    {members.length ? `users ${members} are in this chat!` : ''}
                </Typography>
            </Grid>
            <Grid item>
                <ChatFeed
                    hasInputField={false}
                    messages={renderedMessages}
                    showSenderName
                    bubbleStyles={
                        {
                            text: {
                                fontSize: 20
                            },
                            chatbubble: {
                                borderRadius: 10,
                                padding: 10
                            }
                        }
                    }
                />
            </Grid>
        </Grid>
    );
}
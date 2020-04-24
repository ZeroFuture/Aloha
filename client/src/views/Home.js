import React, {useState, useEffect} from 'react';
import ChannelList from './ChannelList';
import { Redirect } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import Grid from '@material-ui/core/Grid';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SendIcon from '@material-ui/icons/Send';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import RequestForm from '../components/RequestForm';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { ChatFeed, Message } from 'react-chat-ui';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {addMessage, setMessages, addRequest, setRequests, addChannel, setChannels, removeRequest} from '../actions';

import server from '../apis/server';
import { connect } from 'react-redux';

const ENDPOINT = "http://localhost:8080";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: "5%",
        alignItems: 'center',
    },
    channelList: {
        height: "60vh",
        overflowY: "auto",
    },
    exampleWrapper: {
        position: 'relative',
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
          display: 'block',
        },
        fontFamily: 'Comic Neue',
    },
    searchBox: {
        width: "100%",
    },
    sectionDesktop: {
        paddingLeft: "1%",
        display: 'none',
        [theme.breakpoints.up('md')]: {
          display: 'flex',
        },
    },
    chatBox: {
        paddingLeft: "5%",
        paddingRight: "5%",
        height: "60vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column-reverse"
    },
    greetingChat: {
        position: "relative",
        paddingBottom: "10%",
        paddingTop: "5%",
    },
    chatFeed: {
        padding: "5%",
        paddingBottom: "5%",
    }
}));


const mapStateToProps = (state) => {
    return {messages: state.messages, requests: state.requests, channels: state.channels};
};

const actions = [
    { icon: <AddIcon />, name: 'Create a group' },
    { icon: <PersonAddIcon />, name: 'Add a friend' },
    { icon: <GroupAddIcon />, name: 'Join a group'}
];


export const Home = (props) => {
    const classes = useStyles();
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [text, setText] = useState('');
    const [members, setMembers] = useState('');
    const [index, setIndex] = useState(1);
    const [request, setRequest] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const socket = socketIOClient(ENDPOINT);

    useEffect(() => {
        if (!!props.location && !!props.location.state && !!props.location.state.user) {
            const current = props.location.state.user;
            setUser(current);
            props.setChannels(current.channelList);
            props.setRequests(current.receivedRequest);
            socket.on('newRequest' + current.username, (json) => {
                console.log("new request");
                props.addRequest({userId: json.senderId, username: json.senderName});
            });
 
            socket.on('confirmedRequest' + current.username, (json) => {
                console.log("confirmed request");
                console.log(json);
                props.addChannel(json.channel);
            });
        }
        return () => {
            socket.disconnect();
        }
    }, []);

    useEffect(() => {
        if (selectedChannel) {
            socket.on('newMessage' + selectedChannel.channelId, (json) => {
                const message = json.message;
                const channelId = json.channel;
                if (channelId === selectedChannel.channelId) {
                    console.log("new message");
                    const newMessage = new Message({
                        id: message.senderName === user.username ? 0 : index, 
                        message: message.content, 
                        senderName: message.senderName
                    });
                    setIndex(index + 1);
                    props.addMessage(newMessage);
                }
            });
        }
        return () => {
            socket.disconnect();
        }
    }, [selectedChannel]);

    const handleChannelChange = (channel) => {
        setSelectedChannel(JSON.parse(JSON.stringify(channel)));
        server.get(`/channel/${channel.channelId}`).then((res) => {
            if(res.status >= 400) throw new Error(); 
            if (res.data.name) {
                setMembers(res.data.members.map(member => member.username).join(', '));
                var i = 1;
                const initialMessages = res.data.messages.map(message => {
                    return new Message({
                        id: message.senderName === user.username ? 0 : i++, 
                        message: message.content, 
                        senderName: message.senderName
                    });
                });
                props.setMessages(initialMessages);
                setIndex(i);
            }
            console.log("get channel");
        }).catch((error) => {
            console.log(error);
        });
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleNotificationClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleNotificationClose = () => {
        setAnchorEl(null);
    };

    const handleConfirmedRequest = (friend, friendId) => {
        setAnchorEl(null);
        server.post(`/acceptRequest`, {
            senderId: friendId,
            senderName: friend
        }).then((res) => {
            if(res.status >= 400) throw new Error(); 
            if (res.data.name) {
                const newChannel = {
                    channelName: res.data.name, 
                    isGroupChannel: res.data.isGroupChannel, 
                    channelId: res.data._id,
                }
                props.addChannel(newChannel);
                props.removeRequest(friend);
                socket.emit('acceptRequest', {friendUsername: friend, channel: newChannel});
            }
        }).catch((error) => {
            console.log(error);
        });
    };

    const handleAdd = (action) => {
        if (action === 'Create a group') {
            setShowForm(true);
            setRequest('createGroup');
        } else if (action === 'Add a friend') {
            setShowForm(true);
            setRequest('addFriend');
        } else if (action === 'Join a group') {
            setShowForm(true);
            setRequest('joinGroup');
        }
    };

    const sendMessage = () => {
        if (selectedChannel && text) {
            server.post(`/channel/publish/${selectedChannel.channelId}`, {
                "message": text
            }).then((res) => {
                if(res.status >= 400) throw new Error(); 
                if (res.data) {
                    setText('');
                }
                const newMessage = {senderId: user._id, senderName: user.username, content: text};
                socket.emit('createMessage', {message: newMessage, channelId: selectedChannel.channelId});
            }).catch((error) => {
                console.log(error);
            });
        }
    };

    const logout = () => {
        props.history.push("/login");
    }

    const onKeyPress = (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    const onFriendRequest = (friend) => {
        console.log('sending to server socket');
        socket.emit('friendRequest', {username: user.username, userId: user._id, friendUsername: friend});
    }

    if (!props.location || !props.location.state || !props.location.state.user) {
        return <Redirect to='/error' />;
    } else {
        return (
            <Grid container className={classes.root} spacing={2}>
                <Grid item xs={12} md={12}> 
                    <AppBar position="static" color='transparent'>
                        <Toolbar>
                           <Grid
                            justify="space-between" 
                            container 
                            spacing={24}
                        >
                        <Typography variant="h4" className={classes.title} noWrap>
                                <span role="img" aria-label="Fox Face">Aloha! 🦊</span>
                        </Typography>
                        <div className={classes.sectionDesktop}>
                            <IconButton aria-label="notifications" color="inherit" onClick={handleNotificationClick}>
                                <Badge badgeContent={props.requests ? props.requests.length : 0} color="secondary">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleNotificationClose}
                            >
                                {
                                (props.requests ? props.requests.map((friend) => {
                                    return <MenuItem 
                                    key={friend.userId} 
                                    onClick={() => handleConfirmedRequest(friend.username, friend.userId)} >
                                            Accept "{friend.username}" as your friend!
                                        </MenuItem>
                                }) : <MenuItem>Ask your friends to join Aloha!</MenuItem>)
                                }
                            </Menu>
                        </div>
                        <Grid>
                            <Button
                            variant="contained"
                            color="primary"
                            onClick={logout}
                            >
                                Logout
                            </Button>
                        </Grid>
                        </Grid>
                        </Toolbar>
                    </AppBar>
                </Grid>

                <Grid item xs={4} md={4} >
                    <Paper elevation={3}>
                        <Grid className={classes.channelList}>
                            <Grid item>
                                <ChannelList 
                                    onChannelSelect={handleChannelChange}
                                />
                            </Grid>
                        </Grid>
                    </Paper> 
                </Grid>
                <Grid item xs={8} md={8}>
                    <Paper elevation={3}>
                        <Grid className={classes.chatBox}>
                            <Grid item>
                                <ChatFeed
                                    hasInputField={false}
                                    messages={props.messages ? props.messages : []}
                                    showSenderName
                                    bubbleStyles={
                                        {
                                            text: {
                                                fontSize: 25,
                                                fontFamily: 'Comic Neue',
                                            },
                                            chatbubble: {
                                                fontSize: 25,
                                                fontFamily: 'Comic Neue',
                                                borderRadius: 15,
                                                padding: 15
                                            }
                                        }
                                    }
                                />
                            </Grid>
                            <Grid item className={classes.greetingChat}>
                                <Typography 
                                variant="h6" 
                                style={{fontFamily: 'Comic Neue', fontSize: 20}}
                                >
                                    {members.length ? `users ${members} are in this chat!` : ''}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={2} md={2}>
                    <div className={classes.exampleWrapper}>
                        <SpeedDial
                        ariaLabel="SpeedDial"
                        icon={<SpeedDialIcon />}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        open={open}
                        direction='right'
                        >
                        {actions.map((action) => (
                            <SpeedDialAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                                onClick={() => handleAdd(action.name)}
                            />
                        ))}
                        </SpeedDial>
                    </div>
                </Grid>
                <Grid item xs={2} md={2}>
                    <RequestForm show={showForm} 
                    onFinish={() => {
                        setShowForm(false);
                        setRequest(false);
                    }}
                    request={request}
                    friendEmit={onFriendRequest}
                    />
                </Grid>
                <Grid item xs={8} md={8}>
                    <Grid container spacing={1} alignItems="flex-end">
                        <Grid item>
                            <SendIcon />
                        </Grid>
                        <Grid item xs={9} md={9}>
                            <TextField label="message" 
                            value={text}
                            className={classes.searchBox} 
                            onChange={(event) => setText(event.target.value)}
                            onKeyPress={(event) => onKeyPress(event)}
                            />
                        </Grid>
                        <Grid item xs={1} md={1}>
                            <Button
                            variant="contained"
                            color="primary"
                            onClick={sendMessage}
                            >
                                Send
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>  
        );
    }
};

export default connect(mapStateToProps, {
    addMessage: addMessage,
    setMessages: setMessages,
    addRequest: addRequest,
    removeRequest: removeRequest,
    setRequests: setRequests,
    addChannel: addChannel,
    setChannels: setChannels,
})(Home);
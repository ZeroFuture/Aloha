import React, {useState, useEffect} from 'react';
import ChatBox from './ChatBox';
import ChannelList from './ChannelList';
import { Redirect } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import Grid from '@material-ui/core/Grid';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AddIcon from '@material-ui/icons/Add';
import Collapse from '@material-ui/core/Collapse';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Container } from '@material-ui/core';
import AddFriendForm from '../components/AddFriendForm';
import JoinGroupForm from '../components/JoinGroupForm';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CreateGroupForm from '../components/CreateGroupForm';
import server from '../apis/server';

const ENDPOINT = "http://localhost:8080";

const useStyles = makeStyles((theme) => ({
    root: {
        height: "150%",
        width: "120%",
        padding: "5%",
        alignItems: 'center',
    },
    channelList: {
        height: "60vh",
    },
    exampleWrapper: {
        position: 'relative',
    },
    speedDial: {
        // position: 'absolute',
        // '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
        //     bottom: theme.spacing(1),
        //     right: theme.spacing(1),
        // },
        // '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
        //     top: theme.spacing(1),
        //     left: theme.spacing(1),
        // },
    },
    title: {
        margin: theme.spacing(2, 0, 2),
        fontFamily: 'Amatic SC',
    },
    forms: {
        paddingLeft: 0,
        alignItems: "left",
        width: "20%"
    },
    searchBox: {
        width: "100%"
    }
  }));


const actions = [
    { icon: <AddIcon />, name: 'Create a group' },
    { icon: <PersonAddIcon />, name: 'Add a friend' },
    { icon: <GroupAddIcon />, name: 'Join a group'}
];


export default function Home(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [showAddFriend, setShowAddFriend] = useState(false);
    const [showJoinGroup, setShowJoinGroup] = useState(false);
    const [showCreateGroup, setShowGreateGroup] = useState(false);
    const [channels, setChannels] = useState([]);
    const [user, setUser] = useState(null);
    const [channelInfo, setChannelInfo] = useState(null);
    const [text, setText] = useState('');

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        const P2P = require('socket.io-p2p');
        const p2p = new P2P(socket);

        if (!user && !!props.location && !!props.location.state && !!props.location.state.user) {
            setUser(props.location.state.user);
            if (!channels.length && props.location.state.user.channelList) {
                setChannels(props.location.state.user.channelList);
            }
            // p2p.join(props.location.state.user.username);
        }
        
        if (selectedChannel) {
            server.get(`/channel/${selectedChannel.channelId}`).then((res) => {
                if(res.status >= 400) throw new Error(); 
                if (res.data.name) {
                    setChannelInfo(res.data);
                }
            }).catch((error) => {
                console.log(error);
            });
            p2p.emit('joinChannel', (selectedChannel, () => {
                console.log('successfully joined channel');
            }));
        }
    }, [selectedChannel]);

    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    const handleAdd = (action) => {
        if (action === 'Create a group') {
            setShowGreateGroup(true);
            setShowAddFriend(false);
            setShowJoinGroup(false);
        } else if (action === 'Add a friend') {
            setShowGreateGroup(false);
            setShowAddFriend(true);
            setShowJoinGroup(false);
        } else if (action === 'Join a group') {
            setShowGreateGroup(false);
            setShowAddFriend(false);
            setShowJoinGroup(true);
        }
    };

    const sendMessage = () => {
        if (selectedChannel && text) {
            server.post(`/channel/publish/${selectedChannel.channelId}`, {
                "message": text
            }).then((res) => {
                if(res.status >= 400) throw new Error(); 
                if (res.data) {
                    setChannelInfo(res.data);
                    setText('');
                }
            }).catch((error) => {
                console.log(error);
            });
        }
    };

    if (!props.location || !props.location.state || !props.location.state.user) {
        return <Redirect to='/error' />
    } else {
        return (
            <Grid container className={classes.root} spacing={2}>
                <Grid item xs={12} md={12}> 
                    <Typography variant="h2" className={classes.title}>
                            <span role="img" aria-label="Fox Face">Aloha! 🦊</span>
                    </Typography>
                </Grid>
                <Grid item xs={3} md={3}>
                    <Container fixed>
                        <div className={classes.channelList}>
                            <ChannelList 
                                channels={channels} 
                                onChannelSelect={(channel) => {
                                    setSelectedChannel(channel);
                                }}
                            />
                        </div>
                    </Container>
                </Grid>
                <Grid item xs={9} md={9}>
                    <ChatBox channel={channelInfo}/> 
                </Grid>
                <Grid item item xs={3} md={3}>
                    <div className={classes.exampleWrapper}>
                        <SpeedDial
                        ariaLabel="SpeedDial example"
                        className={classes.speedDial}
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
                <Grid item item xs={9} md={9}>
                    <Grid container spacing={1} alignItems="flex-end">
                        <Grid item>
                            <AddIcon />
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <TextField label="message" 
                            className={classes.searchBox} 
                            onChange={(event) => setText(event.target.value)}
                            />
                        </Grid>
                        <Grid item xs={2} md={2}>
                            <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={sendMessage}
                            >
                                Send
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item item xs={12} md={12}>
                    <div className={classes.forms}>
                        <Collapse in={showAddFriend}>
                            <AddFriendForm 
                            onFinish={() => setShowAddFriend(false)}/>
                        </Collapse>
                        <Collapse in={showJoinGroup}>
                            <JoinGroupForm 
                            addChannel={(newChannel) => setChannels([...channels, newChannel])}
                            onFinish={() => setShowJoinGroup(false)}
                            />
                        </Collapse>
                        <Collapse in={showCreateGroup}>
                            <CreateGroupForm 
                            addChannel={(newChannel) => setChannels([...channels, newChannel])}
                            onFinish={() => setShowGreateGroup(false)}
                            />
                        </Collapse>
                    </div>
                </Grid>
            </Grid>  
        );
    }
}
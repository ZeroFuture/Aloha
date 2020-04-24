import React, {useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import Snackbar from '@material-ui/core/Snackbar';
import server from '../apis/server';
import {addChannel} from '../actions';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    row: {
        flexDirection: "row",
    },
    icon: {
        paddingTop: "80%",
    },
    button: {
        paddingTop: "20%",
    }
  }));

export const RequestForm = (props) => {
    const classes = useStyles();

    const [open, setOpen] = useState(props.show);
    const [request, setRequest] = useState(props.request);
    const [text, setText] = useState('');
    const [alert, setAlert] = useState(false);
    const [severity, setSeverity] = useState('error');
    const [messages, setMessages] = useState('');

    useEffect(() => {
        setOpen(props.show);
        setRequest(props.request);
    }, [props]);

    const sendRequest = () => {
        if (request === 'addFriend') {
            friendRequest();
        } else if (request === 'createGroup') {
            createGroupRequest();
        } else if (request === 'joinGroup') {
            joinGroupRequest();
        }
        setText('');
        props.onFinish();
    };

    const joinGroupRequest = () => {
        if (text) {
            server.post(`/channel/join/${text}`).then((res) => {
                if(res.status >= 400) throw new Error(); 
                setAlert(true);
                if (res.data.name) {
                    setSeverity('success');
                    setMessages(`Joined channel ${res.data.name} successfully!`);
                    const newChannel = {
                        channelName: res.data.name, 
                        isGroupChannel: res.data.isGroupChannel, 
                        channelId: res.data._id,
                    }
                    props.addChannel(newChannel);
                } else {
                    console.log(res.data);
                    setSeverity('error');
                    setMessages("Error joining channel");
                }
            }).catch((error) => {
                console.log(error);
                setAlert(true);
                setSeverity('error');
                setMessages('Error joining channel');
            });
        }
    };

    const friendRequest = () => {
        if (text) {
            server.post(`/sendRequest`, {
                receiverName: text
            }).then((res) => {
                if(res.status >= 400) throw new Error(); 
                setAlert(true);
                if (res.data === 'success') {
                    props.friendEmit(text);
                    setSeverity('success');
                    setMessages(`Sent friend request to ${text} successfully!`);
                } else {
                    console.log(res.data);
                    setSeverity('error');
                    setMessages('Error sending friend request');
                }
            }).catch((error) => {
                console.log(error);
                setAlert(true);
                setSeverity('error');
                setMessages('Error sending friend request');
            });
        }
    };

    const createGroupRequest = () => {
        if (text) {
            server.post(`/channel/create`, {
                "name": text
            }).then((res) => {
                if(res.status >= 400) throw new Error(); 
                setAlert(true);
                if (res.data.name) {
                    setSeverity('success');
                    setMessages(`Created channel ${res.data.name} successfully!`);
                    const newChannel = {
                        channelName: res.data.name, 
                        isGroupChannel: res.data.isGroupChannel, 
                        channelId: res.data._id,
                    }
                    props.addChannel(newChannel);
                } else {
                    setSeverity('error');
                    setMessages("Error creating channel");
                }
            }).catch((error) => {
                console.log(error);
                setAlert(true);
                setSeverity('error');
                setMessages('Error creating channel');
            });
        }
    };

    const icon = () => {
        if (request === 'addFriend') {
            return <PersonAddIcon />;
        } else if (request === 'createGroup') {
            return <AddIcon />;
        } else if (request === 'joinGroup') {
            return <GroupAddIcon />;
        } else {
            return <AddIcon />;
        }
    };

    return (
        <Grid container spacing={1}>
            <Grid item>
                <Collapse in={open} className={classes.icon}>
                    {icon()}
                </Collapse>
            </Grid>
            <Grid item xs={7} md={7}>
                <Collapse in={open} >
                    <TextField 
                    className={classes.text} 
                    label={request} 
                    value={text} 
                    onChange={(event) => setText(event.target.value)}/>
                </Collapse>
            </Grid>
            <Grid item xs={2} md={2}>
                <Collapse in={open} className={classes.button}>
                    <Button
                    variant="contained"
                    color="primary"
                    onClick={sendRequest}
                    >
                        Send
                    </Button>
                </Collapse>
            </Grid>
            <Grid item>
                <Snackbar open={alert} autoHideDuration={2000} onClose={() => setAlert(false)}>
                    <Alert severity={severity}>
                        {messages}
                    </Alert>
                </Snackbar>
            </Grid>
        </Grid>
    )
};

const mapStateToProps = (state) => {
    return {channels: state.channels};
};


export default connect(mapStateToProps, {addChannel: addChannel})(RequestForm);

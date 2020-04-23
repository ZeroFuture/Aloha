import React, {useState} from 'react';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import server from '../apis/server';

const useStyles = makeStyles((theme) => ({
    root: {
    },
    button: {
      margin: theme.spacing(1),
    },
  }));

export default function CreateGroupForm(props) {
    const classes = useStyles();

    const [text, setText] = useState('');
    const [alert, setAlert] = useState(false);
    const [severity, setSeverity] = useState('error');
    const [messages, setMessages] = useState('');
    
    const sendRequest = () => {
        if (text) {
            server.post(`/channel/create`, {
                "name": text
            }).then((res) => {
                if(res.status >= 400) throw new Error(); 
                setAlert(true);
                if (res.data.name) {
                    setSeverity('success');
                    setMessages(`channel ${res.data.name} successfully created!`);
                    const newChannel = {
                        channelName: res.data.name, 
                        isGroupChannel: res.data.isGroupChannel, 
                        channelId: res.data._id,
                    }
                    props.addChannel(newChannel);
                    props.onFinish();
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
    }

    return (
        <Container className={classes.root}>
            <Grid container spacing={1} alignItems="flex-end">
                <Grid item>
                    <AddIcon />
                </Grid>
                <Grid item>
                    <TextField label="Group name" onChange={(event) => setText(event.target.value)}/>
                </Grid>
                <Grid item>
                    <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={sendRequest}
                    >
                        Send
                    </Button>
                </Grid>
                <Grid item>
                    <Collapse in={alert}>
                        <Alert severity={severity}>
                        {messages}
                        </Alert>
                    </Collapse>
                </Grid>
            </Grid>
        </Container>
    )

}
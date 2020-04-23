import React from 'react';
import GroupIcon from '@material-ui/icons/Group';
import PersonIcon from '@material-ui/icons/Person';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    demo: {
    },
}));

export default function ChannelList(props) {
    const channels = props.channels;
    const list = channels.filter(channel => channel).map(channel => {
        return (
            <ListItem key={channel.channelId} onClick={() => props.onChannelSelect(channel)}>
            <ListItemAvatar>
                <Avatar>
                {channel.isGroupChannel ? <GroupIcon /> : <PersonIcon />}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={channel.channelName}
                secondary={`channel id: ${channel.channelId}`}
            />
            </ListItem>
        );
    });
    const noFriend = () => {
        return (
            <h4>
                Create a group or add some friends!
            </h4>
        );
    }
    const classes = useStyles();
    return (
        <div>
            <div className={classes.demo}>
                <List>
                    {Array.isArray(list) && list.length ? list : noFriend()}
                </List>
            </div> 
        </div>
    );
}

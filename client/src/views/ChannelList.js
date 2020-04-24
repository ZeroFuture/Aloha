import React, {useEffect, useState} from 'react';
import GroupIcon from '@material-ui/icons/Group';
import PersonIcon from '@material-ui/icons/Person';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

const useStyles = makeStyles(() => ({
    demo: {
        padding: "5%"
    },
    msg: {
        fontFamily: 'Comic Neue',
        fontSize: 20,
    }
}));

export const ChannelList= (props) => {
    const [list, setList] = useState([]);

    useEffect(() => {
        setList(props.channels.map(channel => {
            return (
                <ListItem key={channel.channelId} onClick={() => props.onChannelSelect(channel)}>
                <ListItemAvatar>
                    <Avatar>
                    {channel.isGroupChannel ? <GroupIcon /> : <PersonIcon />}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    classes={{primary: classes.msg, secondary: classes.msg}}
                    primary={channel.channelName}
                    secondary={channel.isGroupChannel ? `channel id: ${channel.channelId}` : 'private chat'}
                />
                </ListItem>
            );
        }));
    },[props]);

    const noFriend = () => {
        return (
            <h4 className={classes.msg}>
                Create a group or add some friends!
            </h4>
        );
    }
    const classes = useStyles();
    return (
        <div className={classes.demo}>
            <List>
                {Array.isArray(list) && list.length ? list : noFriend()}
            </List>
        </div> 
    );
}

const mapStateToProps = (state) => {
    return {channels: state.channels};
};

export default connect(mapStateToProps, {})(ChannelList);

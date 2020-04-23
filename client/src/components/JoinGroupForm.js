import React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import Button from '@material-ui/core/Button';
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
    },
    button: {
      margin: theme.spacing(1),
    },
  }));

export default function JoinGroupForm(props) {
    const classes = useStyles();
    return (
        <Container className={classes.root}>
            <Grid container spacing={1} alignItems="flex-end">
                <Grid item>
                    <GroupAddIcon />
                </Grid>
                <Grid item>
                    <TextField label="Group ID" />
                </Grid>
                <Grid item>
                    <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    >
                        Send
                    </Button>
                </Grid>
            </Grid>
        </Container>
    )

}
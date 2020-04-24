import { combineReducers } from 'redux';

const messagesReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_MESSAGES':
            return action.payload;
        case 'ADD_MESSAGE':
            return [...state, action.payload];
        default:
            return state;
    }
};

const requestsReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_REQUESTS':
            return action.payload;
        case 'ADD_REQUEST':
            return [...state, action.payload];
        case 'REMOVE_REQUEST':
            return state.filter(request => request.username !== action.payload);
        default:
            return state;
    }
};

const channelsReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_CHANNELS':
            return action.payload;
        case 'ADD_CHANNEL':
            return [...state, action.payload];
        default:
            return state;
    }
}


export default combineReducers({
    messages: messagesReducer,
    requests: requestsReducer,
    channels: channelsReducer,
});
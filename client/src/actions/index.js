export const addMessage = (message) => {
    return {
        type: 'ADD_MESSAGE',
        payload: message
    }
};

export const setMessages = (messages) => {
    return {
        type: 'SET_MESSAGES',
        payload: messages
    }
};

export const addRequest = (request) => {
    return {
        type: 'ADD_REQUEST',
        payload: request
    }
};

export const removeRequest = (username) => {
    return {
        type: 'REMOVE_REQUEST',
        payload: username
    }
};

export const setRequests = (requests) => {
    return {
        type: 'SET_REQUESTS',
        payload: requests
    }
};

export const addChannel = (channel) => {
    return {
        type: 'ADD_CHANNEL',
        payload: channel
    }
};

export const setChannels = (channels) => {
    return {
        type: 'SET_CHANNELS',
        payload: channels
    }
};

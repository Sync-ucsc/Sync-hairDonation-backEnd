module.exports.messageResponse = (
    sender,
    receiver,
    message = 'success',
    room,
    type = 'broadcast',
    success = true,
) => {
    return {sender, receiver, message, type, room, success}
};

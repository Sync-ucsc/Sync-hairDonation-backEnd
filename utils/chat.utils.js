/**
 * message object create
 * @param sender userId of a sender
 * @param receiver userId of a receiver
 * @param content <string> content of message default value is welcome
 * @param type <string> type of a message default value set to broadcast
 * @return {{receiver: *, sender: *, type: string, content: string}}
 */
module.exports.messageResponse = (
    sender,
    receiver,
    content = 'welcome',
    type = 'broadcast'
) => {
    return {sender, receiver, type,content}
};

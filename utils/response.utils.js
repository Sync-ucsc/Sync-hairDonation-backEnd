module.exports.sendResponse = (data = '', success = true, debugMessage = 'success') => {
    return {data, success, debugMessage}
};


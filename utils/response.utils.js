/**
 * response object maker
 * @param data if success payload
 * @param success <boolean>
 * @param debugMessage if error occur then error will send
 * @return {{data: string, success: boolean, debugMessage: string}}
 */
module.exports.sendResponse = (data = '', success = true, debugMessage = 'success') => {
    return {data, success, debugMessage}
};


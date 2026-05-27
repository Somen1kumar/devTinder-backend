



const validateStatus = (status) => {

    const allowedStatus = ["interested", "ignored"];
    const isValidStatus = allowedStatus.some(field => field === status);

    return isValidStatus;
}

const validateStatusRequest = (status) => {

    const allowedStatus = ["rejected","accepted"];
    const isValidStatus = allowedStatus.some(field => field === status);

    return isValidStatus;
}

module.exports = {
    validateStatus,
    validateStatusRequest
}
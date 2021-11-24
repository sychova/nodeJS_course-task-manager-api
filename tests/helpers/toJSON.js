module.exports = function toJSON(payload) {
    return JSON.parse(JSON.stringify(payload))
}

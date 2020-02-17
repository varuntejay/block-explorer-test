import moment from 'moment';

module.exports.formatDate = (timestamp) => {
    return moment.unix(timestamp).format('MM/DD/YYYY HH:mm:ss')
}

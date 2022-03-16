const { merge } = require('webpack-merge');
const base = require('./webpack.base');
const prod = merge(base, {
    mode: 'production',
});
module.exports = prod;

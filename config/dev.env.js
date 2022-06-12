'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',

  // 这里可以修改后端的访问地址 也就是后端的接口地址
  BASE_API: '"http://localhost:9001"',
})

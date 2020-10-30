'use strict';

module.exports = function override(config) {
  config.target = 'electron-renderer'

  config.optimization.minimize = false

  const babelRule = config.module.rules[1]
  if (!babelRule.oneOf) {
    throw new Error("Can't find Babel rule for bigint plugin")
  }
  const internalBabelLoader = babelRule.oneOf[2]
  const internalBabelLoaderMatch = internalBabelLoader.include === paths.appSrc && internalBabelLoader.loader === require.resolve('babel-loader')
  if (!internalBabelLoaderMatch) {
    throw new Error("Can't find internal Babel rule for bigint plugin")
  }
  internalBabelLoader.options.plugins.push([require.resolve('@babel/plugin-syntax-bigint')])
  
  const externalBabelLoader = babelRule.oneOf[3]
  const externalBabelLoaderMatch = externalBabelLoader.loader === require.resolve('babel-loader')
  if (!externalBabelLoaderMatch) {
    throw new Error("Can't find external Babel rule for bigint plugin")
  }
  externalBabelLoader.options.plugins = [[require.resolve('@babel/plugin-syntax-bigint')]]

  config.externals = {
    'better-sqlite3': 'commonjs better-sqlite3',
    archiver: 'commonjs archiver',
  }

  return config
}

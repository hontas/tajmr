module.exports = (api) => {
  api.cache(true);
  return {
    presets: [['@babel/preset-env', { useBuiltIns: 'entry', corejs: 3 }], '@babel/preset-react'],
    plugins: [
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-syntax-dynamic-import',
    ],
  };
};

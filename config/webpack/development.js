import puiAliases from '../../helpers/pui-aliases';

export default {
  devtool: 'inline-source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ["es2015", "react", "stage-2"],
          plugins: ["transform-runtime"]
        }
      },
      {
        test: /bootstrap/,
        loader: 'imports?jQuery=jquery'
      }
    ]
  },
  resolve: {
    alias: {
      bootstrap: `${__dirname}/../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js`,
      ...puiAliases
    }
  }
};

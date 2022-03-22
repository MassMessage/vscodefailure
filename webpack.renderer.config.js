const rules = require('./webpack.rules');
const path = require('path');
const publicPath = path.resolve(__dirname, 'public');
const renderPath = path.resolve(__dirname, '.webpack/renderer');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

rules.push({
    test: /\.jsx?$/,
    loader: "babel-loader",
    exclude: [/node_modules/, /public/]
});

module.exports = {
  target: 'node',
  entry: {
    index: './src/render/index.js',

    'editor.worker':{
      import: 'monaco-editor/esm/vs/editor/editor.worker.js',
      //filename: '../../public/editor.worker.bundle.js'

      // filename only accepts a relative path, so we generate the relative path
      // from the renderPath to publicPath then concat that relative path with
      // the expected otuput worker bundler filename.
      // We need that file available on public folder by monaco environment
      filename: path.join(path.relative(renderPath, publicPath), 'editor.worker.bundle.js')
    },

    // !!!NOTE!!! READ THTAT TO UNDERSTAND WHY THE REAL PRELOAD IS SET HERE
    //
    // this is the real preloader used by this application.
    // for some reason, when we set 'entry' section in this config file,
    // the preload in @electron-forge/plugin-webpack.renderer.entryPoints.preload
    // section in the package.json no longer works. It just doesn't generate the preload
    // in the output folder so the file pointed by MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    // is nonexistent. To workaround this, we set the preload here as entry file, so that the
    // filename pointed by MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY gets transpiled by webpack.
    // note that the value of @electron-forge/plugin-webpack.renderer.entryPoints.preload
    // in package.json isn't emmpty; it seems that removing it make the MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    // to not working anymore.
    //
    // note that idk yet if this a bug (seems likely), i couldn't find the answer yet.
    //
    // !!VERY IMPORTANT!! when change the path here, change on MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    // as well, so that we have a sync filename. Yeah, it sucks but that's we got so far with
    // that build system and fucking javascript.
    preload: {
      import: './src/preload.js',
      filename: 'preload.js' // name shall not have 'bundle' suffix
    },
  },
  output: {
    filename: '[name].bundle.js'
  },
  module: {
    rules
  },
  resolve: {
    alias: {
      '@Shared': path.resolve(__dirname, 'src/shared'),
      'vscode': require.resolve('@codingame/monaco-languageclient/lib/vscode-compatibility')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.ttf']
  }

  // TODO: use UglifyJSPlugin plugin here
  // TODO 2: do use of soruce maps...
};
exports.files = {
  javascripts: {joinTo: 'cv2-hyperscroll.js'},
};

exports.plugins = {
  babel: {
    presets: [[ "minify" , { builtIns: false } ]]
  },
  raw: {
    pattern: /\.(html|jss)$/,
    wrapper: content => `module.exports = ${JSON.stringify(content)}`
  }
};

exports.paths = {
  public: 'dist', watched: ['source', 'build']
};

exports.modules = {
	nameCleaner: path => path.replace(/^(source|build)?\//, 'cv2-hyperscroll/')
}

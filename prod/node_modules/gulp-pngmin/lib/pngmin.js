(function() {
  var fs, gutil, os, path, pngquant, sprintf, through2;

  os = require('os');

  fs = require('fs');

  path = require('path');

  through2 = require('through2');

  pngquant = require('pngquant');

  gutil = require('gulp-util');

  sprintf = require('sprintf');

  module.exports = function(options) {
    if (options == null) {
      options = [256];
    }
    return through2.obj(function(file, enc, cb) {
      var filepath, originalSize, self, tmpFilePath, writeStream;
      filepath = path.relative(process.cwd(), file.path);
      if (file.isNull()) {
        this.push(file);
        return cb();
      }
      if (file.isBuffer()) {
        originalSize = file.contents.length;
        tmpFilePath = path.resolve(os.tmpdir(), 'pngmin_' + (+(new Date)) + '_' + path.basename(file.path));
        writeStream = fs.createWriteStream(tmpFilePath);
        file.pipe(new pngquant(options)).pipe(writeStream);
        self = this;
        writeStream.on('close', function() {
          var percent, size;
          size = fs.statSync(tmpFilePath).size;
          if (originalSize > size) {
            percent = sprintf('%.2f', 100 - Math.floor((size / originalSize) * 10000) * .01);
            gutil.log('pngquant:', gutil.colors.cyan(filepath), originalSize + 'bytes to ' + size + 'bytes (-' + percent + '%)');
            file.contents = fs.readFileSync(tmpFilePath);
          }
          fs.unlinkSync(tmpFilePath);
          self.push(file);
          return cb();
        });
      }
      if (file.isStream()) {
        gutil.log('pngquant:', gutil.colors.cyan(filepath));
        file.contents = file.contents.pipe(new pngquant(options));
        this.push(file);
        return cb();
      }
    });
  };

}).call(this);

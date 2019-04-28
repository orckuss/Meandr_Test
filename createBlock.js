'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');

let blockName = process.argv[2];
let defaultExtensions = ['pug', 'styl', 'js'];
let extensions = uniqueArray(defaultExtensions.concat(process.argv.slice(3)));

if(blockName) {

  let dirPath = 'src/blocks/' + blockName + '/';
  mkdirp(dirPath, function(err){

    if(err) {
      console.error('Отмена операции: ' + err);
    }

    else {
      console.log('Создание папки ' + dirPath + ' (создана, если ещё не существует)');

      mkdirp(dirPath + 'img/');
      mkdirp(dirPath + 'img/icons/');

      extensions.forEach(function(extention) {

        let filePath = dirPath + blockName + '.' + extention;
        let fileContent = '';
        let fileImport = '';

        if(extention == 'styl') {
          fileImport = '@import "../blocks/' + blockName + '/' + blockName + '"';
          fileContent = '// .' + blockName;

          fs.appendFile('src/styles/style.styl', fileImport + '\n', function (err) {
            if(err) {
              return console.log('style.styl НЕ обновлён: ' + err);
            }
            console.log('style.styl обновлён');
          });
        }

        if(extention == 'pug') {
          fileImport = 'include ../blocks/' + blockName + '/' + blockName;
          fileContent = 'mixin ' + blockName + '()\n  .' + blockName + '&attributes(attributes)';

          fs.appendFile('src/templates/blocks.pug', fileImport + '\n', function (err) {
            if(err) {
              return console.log('blocks.pug НЕ обновлён: ' + err);
            }
            console.log('blocks.pug обновлён');
          });
        }

        if(!fileExist(filePath)) {

          fs.writeFile(filePath, fileContent, function(err) {
            if(err) {
              return console.log('Файл НЕ создан: ' + err);
            }
            console.log('Файл создан: ' + filePath);
          });
        }
        else {
          console.log('Файл НЕ создан: ' + filePath + ' (уже существует)');
        }

      });
    }
  });
}
else {
  console.log('Отмена операции: не указан блок');
}

function uniqueArray(arr) {
  var objectTemp = {};
  for (var i = 0; i < arr.length; i++) {
    var str = arr[i];
    objectTemp[str] = true;
  }
  return Object.keys(objectTemp);
}

function fileExist(path) {
  const fs = require('fs');
  try {
    fs.statSync(path);
  } catch(err) {
    return !(err && err.code === 'ENOENT');
  }
}

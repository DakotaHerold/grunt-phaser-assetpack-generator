/*
 * grunt-phaser-assetpack-generator
 * https://github.com/hilts-vaughan/grunt-phaser-assetpack-generator
 *
 * Copyright (c) 2016 Vaughan Hilts
 * Licensed under the MIT license.
 */

'use strict';
var tilemapModule = require('./modules/tiled_map_handler')

module.exports = function(grunt) {
  grunt.registerMultiTask('phaser_assetpack_generator', 'This tool helps you generate an asset pack from your filesystem directory, so that you can easily preload all your assets required for your Phaser game.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    // TODO: We will need support for custom asset packer handles
    // and the like so that others can prepare things accordingly?

    var processFiles = function(files, destination, processor) {

      // First Add Asset packs to json. Filtered by directory. 
      var assetJson = {}; 

      files.forEach(function(file) {
        // Add directories - these will be our asset packs themselves 
        if(grunt.file.isDir(file)) {
          var dirPath = file.toString(); 
          var arr = dirPath.split('/');

          var target = null; 

          var i; 
          for(i = 0; i < arr.length; i++)
          {
            if(i > 0)
            {
              var prev = arr[i-1].toLowerCase();
              
              if(prev === 'assets')
              {
                target = arr[i].toString(); 
                break; 
              }
            }
          }

          if(target !== null)
          {
            // Check if pack has already been generated
            if(!Object.keys(assetJson).includes(target))
            {
              var packTitle = target.toString(); 
              var packJson = { files: [] };
              assetJson[packTitle] = packJson; 
              //grunt.log.writeln(target);
            }
            
          } 
          
        }
      }); 

      // Add metadata objects pack for loading purposes 
      assetJson['meta'] = {
        "generated": "1401380327373",
        "app": "Phaser 3 Asset Packer",
        "url": "https://phaser.io",
        "version": "1.0",
        "copyright": "Photon Storm Ltd. 2018"
      };



      // Iterate through all files and add files to corresponding asset pack 
      files.forEach(function(file) {
        // Skip directories
        if(!grunt.file.isDir(file)) {

          // Iterate over all pack objects
          Object.keys(assetJson).forEach(function(key) {
            var keyStr = key.toString(); 
            //grunt.log.writeln(keyStr); 

            var currentFilePath = file.toString(); 
            // If key matches, it belongs in that pack 
            // NOTE: pack directory names must not repeat in subfolders
            if(currentFilePath.includes(keyStr))
            {
              var asset = processor(file, grunt)
              if(asset) {

                // Check if file already exists 
                var exists = false; 

                assetJson[keyStr].files.forEach(function(existingFile){

                  // Get file extension as two files can have the same name 
                  var extensionsMatch = false; 

                  if(typeof existingFile.url !== 'undefined' && typeof asset.url !== 'undefined')
                  {
                    var extensionOne = existingFile.url.substring(file.lastIndexOf('.') + 1);
                    var extensionTwo = asset.url.substring(file.lastIndexOf('.') + 1);
                    if(extensionOne == extensionTwo)
                    {
                      extensionsMatch = true; 
                    }
                  }
                  
                  // Special case for audio as audio files can stack under one key
                  if(typeof asset.type !== 'undefined')
                  {
                    if(asset.type === 'audio')
                    {
                      if(existingFile.key === asset.key)
                      {
                        exists = true; 
                      }
                    }
                    else 
                    {
                      if(existingFile.key === asset.key && extensionsMatch)
                      {
                        exists = true; 
                      }
                    }
                  }
                  
                });

                if(exists === false)
                {
                  assetJson[keyStr].files.push(asset);  
                }           


              }
            }
          }); 

          
        }
      });


      return assetJson;
    } // end process files

    // Iterate over all specified file groups.
    this.files.forEach(function(file) {
      var filesGood = file.src.filter(function(filepath) {
          // Remove nonexistent files (it's up to you to filter or warn here).
          if (!grunt.file.exists(filepath)) {
            grunt.log.warn('Source file "' + filepath + '" not found.');
            return false;
          } else {
            return true;
          }
        });


        var processor = file.processor
        // If not a function, then try to load the built-in map
        if(processor != 'function') {
          processor = assetHandlerMap[file.processor]
          if(!processor) {
            grunt.fail.warn('A processor must be specified. Use "default" if you want things to be handled without much friction.');
          }
        }

        // Kick off the processing
        var assetJson = processFiles(filesGood, file.dest, processor)

        // Write out the asset json
        grunt.file.write(file.dest, JSON.stringify(assetJson, null, 2));
    }); // end files

  }); // end multi-task
}; // end exports

var isAudioFile = function(file) {
  var extension = file.substring(file.lastIndexOf('.') + 1)
  if(['mp3', 'ogg', 'm4a'].indexOf(extension) > -1) {
    return true;
  }
  return false;
}

var isImageFile = function(file) {
  var extension = file.substring(file.lastIndexOf('.') + 1)
  if(['png', 'jpg', 'gif'].indexOf(extension) > -1) {
    return true;
  }
  return false;
}

// Each handler returns a JSON of its configuration
var assetHandlerDefault = function(file, grunt) {
    var extension = file.substring(file.lastIndexOf('.') + 1)
    switch(extension) {
      case 'png':
      case 'jpg':
      case 'gif':
        return imageHandler(file)
      case 'mp3':
      case 'ogg':
      case 'm4a':
      case 'mp4':
        return audioHandler(file, grunt)
      case 'txt':
        return textHandler(file)
      case 'json':
        return jsonHandler(file)
      case 'xml':
        return xmlHandler(file)
      case 'fnt': 
        return fntHandler(file)
      case 'tmx':
        return tilemapModule.tileMapHandler(file, grunt)
      default:
        grunt.log.warn('Could not figure out how to handle file: ' + file + ' so decided to skip it.')
    }
}

var getKeyName = function(file)
{
	var fullPath = file;
	var keyName = fullPath.replace(/^.*[\\\/]/, '');
	var extension = file.substring(file.lastIndexOf('.') + 1);
	extension = '.' + extension; 
	keyName = keyName.replace(extension,'');
	
	return keyName; 
}

var getPackName = function(file)
{
  var dirPath = file.toString(); 
  var arr = dirPath.split('/');

  var target = null; 

  var i; 
  for(i = 0; i < arr.length; i++)
  {
    if(i > 0)
    {
      var prev = arr[i-1].toLowerCase();
      
      if(prev === 'assets')
      {
        target = arr[i].toString(); 
        break; 
      }
    }
  }

  if(target === null)
  {
    return '';
  }
  else 
  {
    return target; 
  }

}

var imageHandler = function(file) {
  var keyName = getKeyName(file); 
	
  return {
    type: 'image',
    key: keyName,
    url: file
  }
}

var audioHandler = function(file, grunt) {
  var keyName = getKeyName(file); 
  var packName = getPackName(file); 
	
  var urls = [];
  grunt.file.recurse(file.substring(0, file.lastIndexOf('/')), function(audioFile) {
    if(isAudioFile(audioFile)) {
      urls.push(audioFile)
    }
  })
  // TODO: Find a way to merge all the audio together
  return {
    type: 'audio',
    key: keyName,
    pack: packName, 
    autoDecode: true,
    urls: urls
  }
}

var textHandler = function(file) {
  var keyName = getKeyName(file); 
  
  return {
    type: 'text',
    key: keyName,
    url: file,
    overwrite: true
  }
}

var jsonHandler = function(file) {
  var keyName = getKeyName(file); 
  
  return {
    type: 'json',
    key: keyName,
    url: file,
    overwrite: true
  }
}

var xmlHandler = function(file) {
  var keyName = getKeyName(file); 
  var packName = getPackName(file); 
  
  return {
    type: 'xml',
    key: keyName,
    url: file,
    pack: packName, 
    overwrite: true
  }
}

var fntHandler = function(file, grunt) {

  //var extension = file.substring(file.lastIndexOf('.') + 1);
  //var destFilePath = file.replace(extension, '.xml'); 
  
  //grunt.log.writeln('test');  

  //var fileContents = grunt.file.read(file.toString()); 


  //grunt.file.write(destFilePath, fileContents); 
  //grunt.file.delete(file); 
  
  //return xmlHandler(destFilePath); 
}


var tmxTilesetHandler = function(file)  {

}

// The below is a map of built-in handlers and how they can be used
var assetHandlerMap = {
  default: assetHandlerDefault,
  audio: audioHandler,
  image: imageHandler,
  text: textHandler,
  json: jsonHandler,
  xml: xmlHandler,
  fnt : fntHandler,
  tilemap: tilemapModule.tileMapHandler
}

// TODO: How to handle spritesheets? There's a lot of different spritesheet formats
// and things to handle...
// Texture Packer & a custom format might be a good place to start
// bleck... this is good enough for now :)

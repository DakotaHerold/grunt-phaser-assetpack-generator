/*
 * grunt-phaser-assetpack-generator
 * https://github.com/hilts-vaughan/grunt-phaser-assetpack-generator
 *
 * Copyright (c) 2016 Vaughan Hilts
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    phaser_assetpack_generator: {
      default: {
        files: [
          {
            src: ['../src/assets/**', '!**/*.json'],
            dest: '../src/Manifest/AssetManifest.json',
            processor: 'default'
          }
        ]
      }
    }, 

    // Convert all .fnt files to .xml 
    // convertFntToXml: {
    //   default: {
    //     files: [
    //       {
    //         expand: true,
    //         dot: true,
    //         src: ['../src/assets/**'],
    //         processor: 'default'
    //       }
    //     ]
    //   }
    // }, 

    convertFntToXml: {
      default:{
        files: [{
          expand: true,
          src: ['../src/assets/**'],
          processor: 'default'
          // rename: function (dest, src) {          // The `dest` and `src` values can be passed into the function
          //   return src.replace('.fnt','xml'); // The `src` is being renamed; the `dest` remains the same
          // }
        }]
      }
    },
    
    // Manifest Exporter 
    ManifestExporter: {
      default: {
        files: 
          {
            src: '../src/Manifest/AssetManifest.json',
            dest: '../src/Manifest/AssetManifest.js',
            processor: 'default'
          }
        
      }
    }


  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');

  //grunt.loadNpmTasks('grunt-contrib-convertFntToXml'); 
  
  //grunt.loadNpmTasks('grunt-phaser-assetpack-generator');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('default', 'copy', ['clean', 'phaser_assetpack_generator', 'convertFntToXml', 'ManifestExporter']);
};

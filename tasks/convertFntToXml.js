module.exports = function(grunt){

    

    grunt.registerMultiTask('convertFntToXml', 'A task that converts all .fnt files in assets to xml for phaser', function(){
        
        var processFiles = function(files, processor) {
            //grunt.log.writeln('damn Im tired');
            files.forEach(function(file) {
                //grunt.log.writeln(file); 
                var prefix = '../src/assets/';

                var extension = '.' + file.substring(file.lastIndexOf('.') + 1);
                

                //grunt.log.writeln(extension); 
                var fileContents = grunt.file.read(prefix+file); 
                var dest = prefix + file.replace(extension, '.xml'); 
                grunt.file.write(dest, fileContents); 
                grunt.file.delete(prefix+file, {force:true});
            }); 
        }
        
        
        
        
        
        
        
        // List all files in the templates directory.
        var fontFiles = grunt.file.expand({filter: function(file){
            var ext = file.substring(file.lastIndexOf('.') + 1);

            if(grunt.file.isFile(file) && ext === 'fnt')
            {
                return true; 
            }
            else {
                return false; 
            }
        }, cwd: "../src/assets"},  ["**"]);

        var deleteFiles = []; 

        // fontFiles.forEach(function(file){

        //     var prefix = '../src/assets/';

        //     //grunt.log.writeln(file); 
        //     //deleteFiles.push(prefix+file); 

        //     var test = grunt.file.expand(file); 

        //     //var content = grunt.file.read(file); 
        //     // var newDest = (prefix+file).replace('.fnt', '.xml');
        //     // grunt.file.write(newDest, content);  
        // });

    
        

        processFiles(fontFiles, this.files.processor); 

    
        

});

    //grunt.registerMultiTask('convertFntToXml', 'A task that converts all .fnt files in assets to xml for phaser', function() {
        
        



    //     var processFiles = function(files, processor) {

    //         files.forEach(function(file) {
    //             //grunt.log.writeln(file); 

    //             var extension = '.' + file.substring(file.lastIndexOf('.') + 1);
    //             if(extension !== '.fnt')
    //             {
    //                 return;
    //             }

    //             //grunt.log.writeln(extension); 
    //             var fileContents = grunt.file.read(file); 
    //             var dest = file.replace(extension, '.xml'); 
    //             //grunt.log.writeln(dest); 

                
                
                
    //             //grunt.log.writeln(dir); 

    //             var target = file; 
    //             grunt.file.write(dest, fileContents); 
    //             deleteFiles.push(target); 
                 

    //             // grunt.log.writeln(fileContents); 
    //         }); 
            
    //     };
        
        
    //     // Iterate over all specified file groups.
    //     this.files.forEach(function(file) {
    //     var filesGood = file.src.filter(function(filepath) {

    //         var extension = filepath.substring(filepath.lastIndexOf('.') + 1);

    //         // Remove nonexistent files (it's up to you to filter or warn here).
    //         if (!grunt.file.exists(filepath)) {
    //           grunt.log.warn('Source file "' + filepath + '" not found.');
    //           return false;
    //         } else if(extension === 'fnt') {
    //           return true;
    //         }
    //       });
  
  
        //   var processor = file.processor
        //   // If not a function, then try to load the built-in map
        //   if(processor != 'function') {
        //     processor = assetHandlerMap[file.processor]
        //     if(!processor) {
        //       grunt.fail.warn('A processor must be specified. Use "default" if you want things to be handled without much friction.');
        //     }
        //   }
  
        //   processFiles(filesGood, processor); 
    //   }); // end files


    // });
}

// Each handler returns a JSON of its configuration
// var assetHandlerDefault = function(file, grunt) {
//     var extension = file.substring(file.lastIndexOf('.') + 1);
//     switch(extension) {
//       case 'fnt':
//         return fntHandler(file)
//       default:
//           break; 
//         //grunt.log.warn('Could not figure out how to handle file: ' + file + ' so decided to skip it.')
//     }
// }

// var fntHandler = function(file, grunt) {

//     //return file.replace(/\.fnt$/, ".xml")
    
// }

// var assetHandlerMap = {
//     default: assetHandlerDefault,
//     fnt : fntHandler
//   }

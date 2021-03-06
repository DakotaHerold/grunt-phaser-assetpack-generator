
//'use strict'; 

module.exports = function(grunt){
    

    grunt.registerMultiTask('ManifestExporter', 'A task that parses phaser asset packs into referenceable javascript variables for phaser.', function() {
       
        //grunt.log.write(this.data.files.src); 
        var rawJSON = grunt.file.readJSON(this.data.files.src); 
        var _packs = null; 
        var _images = null; 
        var _audio = null; 
        var _text = null; 
        var _json = null; 
        var _xml = null; 
        var _fnt = null; 

        //grunt.log.writeln(Object.keys(rawJSON)); 

        // Cache Pack Properties for later 
        var packNameIndex; 
        for(packNameIndex = 0; packNameIndex < Object.keys(rawJSON).length; ++packNameIndex)
        {
            var packName = Object.keys(rawJSON)[packNameIndex]; 

            // Cache Pack Properties for later
            if(_packs === null)
            {
                _packs = new Array(); 
                _packs.push(packName); 
            }
            else 
            {
                if(!_packs.includes(packName))
                {
                    _packs.push(packName); 
                }
            }
        }


        // Loop over all asset packs 
        var packIndex; 
        for(packIndex = 0; packIndex <  Object.values(rawJSON).length; packIndex++)
        {
            var packProperty = Object.values(rawJSON)[packIndex]; 

            
            
            // Pack is either meta data or not formatted correctly so ignore it
            if(typeof packProperty.files === 'undefined')
                continue; 

            //grunt.log.writeln(Object.getOwnPropertyNames(packProperty)); 

            // Grab files 
            var _assets = packProperty.files; 
            
            // Parse json data from file into usable variables 
            var assetIndex; 
            for(assetIndex = 0; assetIndex < _assets.length; assetIndex++)
            {
                
                //grunt.log.write(_assets[assetIndex].type);
 
                if(_assets.type === null)
                {
                    continue; 
                }

                switch(_assets[assetIndex].type)
                {
                    case 'image':
                        if(_images === null)
                        {
                            _images = new Array(); 
                            _images.push(_assets[assetIndex]); 
                        }
                        else 
                        {
                            _images.push(_assets[assetIndex]); 
                        }
                        
                        break; 
                    case 'audio':

                        if(_audio === null)
                        {
                            _audio = new Array(); 
                            _audio.push(_assets[assetIndex]); 
                        }
                        else 
                        {
                            _audio.push(_assets[assetIndex]); 
                        }
                        break; 
                    case 'text':

                        if(_text === null)
                        {
                            _text = new Array(); 
                            _text.push(_assets[assetIndex]); 
                        }
                        else 
                        {
                            _text.push(_assets[assetIndex]); 
                        }
                        break; 
                    case 'json':

                        if(_json === null)
                        {
                            _json = new Array(); 
                            _json.push(_assets[assetIndex]); 
                        }
                        else 
                        {
                            _json.push(_assets[assetIndex]); 
                        }
                        break; 
                    case 'xml':

                        if(_xml === null)
                        {
                            _xml = new Array(); 
                            _xml.push(_assets[assetIndex]); 
                        }
                        else 
                        {
                            _xml.push(_assets[assetIndex]); 
                        }
                        break; 
                    case 'fnt':

                        if(_fnt === null)
                        {
                            _fnt = new Array(); 
                            _fnt.push(_assets[assetIndex]); 
                        }
                        else 
                        {
                            _fnt.push(_assets[assetIndex]); 
                        }
                        break; 
                }
            }
        }

 

        // Create JS file

        var fileStr = "// Asset Manfiest Reference Classes. Generated by grunt. Copyright Dakota Herold 2020 \n\n"

        // Images Class 
        fileStr += "class Image {"; 

        // Generate Properties with JS Doc for VSCode Intellisense auto completion 
        if(_images !== null)
        {
            fileStr += "\n  // Properties"; 
            fileStr += "\n  /**"; 

            var index; 
            for(index = 0; index < _images.length; index++)
            {
                fileStr += "\n    " + _images[index].key.toString().toUpperCase() + "--------------";
                fileStr += "\n    @property {object} " +  _images[index].key.toString(); 
                fileStr += "\n    @property {string} " +  _images[index].key.toString()+".key";  
                fileStr += "\n    @property {string} " +  _images[index].key.toString()+".path"; 
                fileStr += "\n+   ----------------------------";
            }
            

            fileStr += "\n  */\n"; 
        }

        fileStr += "\n  constructor() {"
        if(_images === null)
        {
            fileStr += '\n'; 
        }
        else 
        {
            var i; 
            for(i = 0; i < _images.length; i++)
            {
                fileStr += "\n      this." + _images[i].key.toString() + " = " + " { "; 
                fileStr += "key: " + "\"" + _images[i].key.toString() + "\",";
                fileStr += " path: " + "\"" + _images[i].url.toString() + "\"";
                fileStr += " };"; 
            }
        }
        fileStr += "\n  }"; 


        fileStr += "\n}\n\n"; 

        // Audio Class
        fileStr += "class Audio {"; 

        // Generate Properties with JS Doc for VSCode Intellisense auto completion 
        if(_audio !== null)
        {
            fileStr += "\n  // Properties"; 
            fileStr += "\n  /**"; 

            var index; 
            for(index = 0; index < _audio.length; index++)
            {
                fileStr += "\n    " + _audio[index].key.toString().toUpperCase() + "--------------";
                fileStr += "\n    @property {object} " +  _audio[index].key.toString(); 
                fileStr += "\n    @property {string} " +  _audio[index].key.toString()+".pack";  
                fileStr += "\n    @property {string} " +  _audio[index].key.toString()+".key";  
                fileStr += "\n    @property {string[]} " +  _audio[index].key.toString()+".paths"; 
                fileStr += "\n+   ----------------------------";
            }
            

            fileStr += "\n  */\n"; 
        }

        fileStr += "\n  constructor() {"

        if(_audio === null)
        {
            fileStr += '\n'; 
        }
        else 
        {
            var i; 
            for(i = 0; i < _audio.length; i++)
            {
                fileStr += "\n      this." + _audio[i].key.toString() + " = " + " { "; 
                fileStr += "pack: " + "\"" + _audio[i].pack.toString() + "\", ";
                fileStr += "key: " + "\"" + _audio[i].key.toString() + "\",";
                fileStr += " paths: " + "[";
                _audio[i].urls.forEach(function(url){
                    fileStr += "\"" + url + "\",";
                });

                // Cut off last comma
                fileStr = fileStr.substring(0, fileStr.length-1); 
                
                fileStr += "]";
                fileStr += " };";  
            }
        }
        fileStr += "\n  }"; 

        fileStr += "\n}\n\n"; 

        // Text 
        fileStr += "class Text {"; 
        fileStr += "\n  constructor() {"

        // Generate Properties with JS Doc for VSCode Intellisense auto completion 
        if(_text !== null)
        {
            fileStr += "\n  // Properties"; 
            fileStr += "\n  /**"; 

            var index; 
            for(index = 0; index < _xml.length; index++)
            {
                fileStr += "\n    " + _text[index].key.toString().toUpperCase() + "--------------";
                fileStr += "\n    @property {object} " +  _text[index].key.toString(); 
                fileStr += "\n    @property {string} " +  _text[index].key.toString()+".key";  
                fileStr += "\n    @property {string} " +  _text[index].key.toString()+".path"; 
                fileStr += "\n+   ----------------------------";
            }
            

            fileStr += "\n  */\n"; 
        }

        if(_text === null)
        {
            fileStr += '\n'; 
        }
        else 
        {
            var i; 
            for(i = 0; i < _text.length; i++)
            {
                fileStr += "\n      this." + _text[i].key.toString() + " = " + " { "; 
                fileStr += "key: " + "\"" + _text[i].key.toString() + "\",";
                fileStr += " path: " + "\"" + _text[i].url.toString() + "\"";
                fileStr += " };"; 
            }
        }
        fileStr += "\n  }"; 

        fileStr += "\n}\n\n"; 

        // JSON 
        fileStr += "\nclass Json {"; 

        // Generate Properties with JS Doc for VSCode Intellisense auto completion 
        if(_json !== null)
        {
            fileStr += "\n  // Properties"; 
            fileStr += "\n  /**"; 

            var index; 
            for(index = 0; index < _json.length; index++)
            {
                fileStr += "\n    " + _json[index].key.toString().toUpperCase() + "--------------";
                fileStr += "\n    @property {object} " +  _json[index].key.toString(); 
                fileStr += "\n    @property {string} " +  _json[index].key.toString()+".key";  
                fileStr += "\n    @property {string} " +  _json[index].key.toString()+".path"; 
                fileStr += "\n+   ----------------------------";
            }
            fileStr += "\n  */\n"; 
        }

        fileStr += "\n  constructor() {"

        if(_json === null)
        {
            fileStr += '\n'; 
        }
        else 
        {
            var i; 
            for(i = 0; i < _json.length; i++)
            {
                fileStr += "\n      this." + _json[i].key.toString() + " = " + " { "; 
                fileStr += "key: " + "\"" + _json[i].key.toString() + "\",";
                fileStr += " path: " + "\"" + _json[i].url.toString() + "\"";
                fileStr += " };"; 
            }
        }
        fileStr += "\n  }"; 

        fileStr += "\n}\n\n"; 

        // XML 
        fileStr += "class Xml {"; 

        // Generate Properties with JS Doc for VSCode Intellisense auto completion 
        if(_xml !== null)
        {
            fileStr += "\n  // Properties"; 
            fileStr += "\n  /**"; 

            var index; 
            for(index = 0; index < _xml.length; index++)
            {
                fileStr += "\n    " + _xml[index].key.toString().toUpperCase() + "--------------";
                fileStr += "\n    @property {object} " +  _xml[index].key.toString(); 
                fileStr += "\n    @property {string} " +  _xml[index].key.toString()+".key"; 
                fileStr += "\n    @property {string} " +  _xml[index].key.toString()+".pack"; 
                fileStr += "\n    @property {string} " +  _xml[index].key.toString()+".path"; 
                fileStr += "\n+   ----------------------------";
            }
            fileStr += "\n  */\n"; 
        }

        fileStr += "\n  constructor() {"

        if(_xml === null)
        {
            fileStr += '\n'; 
        }
        else 
        {
            var i; 
            for(i = 0; i < _xml.length; i++)
            {
                fileStr += "\n      this." + _xml[i].key.toString() + " = " + " { "; 
                fileStr += "key: " + "\"" + _xml[i].key.toString() + "\",";
                fileStr += " pack: " + "\"" + _xml[i].pack + "\",";
                fileStr += " path: " + "\"" + _xml[i].url.toString() + "\"";
                fileStr += " };"; 
            }
        }
        fileStr += "\n  }"; 

        fileStr += "\n}\n\n"; 

        // Asset Packs 
        fileStr += "class AssetPack {"; 

        // Generate Properties with JS Doc for VSCode Intellisense auto completion 
        if(_packs !== null)
        {
            fileStr += "\n  // Properties"; 
            fileStr += "\n  /**"; 

            var index; 
            for(index = 0; index < _packs.length; index++)
            {
                fileStr += "\n    @property {string} " +  _packs[index]; 
            }
            

            fileStr += "\n  */\n"; 
        }

        fileStr += "\n  constructor() {"

        if(_packs === null)
        {
            fileStr += '\n'; 
        }
        else 
        {
            // Generate Properties 
            var i; 
            for(i = 0; i < _packs.length; i++)
            {
                fileStr += "\n      this." + _packs[i] + " = " ; 
                fileStr += "\"" + _packs[i] + "\""
                //fileStr += " key: " + "\"" + _packs[i] + "\"";
                fileStr += ";"; 
            }
        }
        fileStr += "\n  }"; 

        fileStr += "\n}\n\n"; 

        

        fileStr += "\n"

        // Create Asset Manifest class 
        fileStr += "export class AssetManifest {"; 

        // Generate Properties with JS Doc for VSCode Intellisense auto completion 
        fileStr += "\n  // Properties"; 
        fileStr += "\n  /**"; 

        fileStr += "\n    @property {AssetPack} AssetPack"; 
        fileStr += "\n    @property {Image} Image"; 
        fileStr += "\n    @property {Audio} Audio"; 
        fileStr += "\n    @property {Text} Text"; 
        fileStr += "\n    @property {Json} Json"; 
        fileStr += "\n    @property {Xml} Xml"; 

        fileStr += "\n  */\n"; 


        fileStr += "\n  constructor() {"
        fileStr += "\n      this.AssetPack = new AssetPack();"; 
        fileStr += "\n      this.Image = new Image();"; 
        fileStr += "\n      this.Audio = new Audio();"; 
        fileStr += "\n      this.Text = new Text();"; 
        fileStr += "\n      this.Json = new Json();"; 
        fileStr += "\n      this.Xml = new Xml();"; 
        fileStr += "\n  }"; 
        fileStr += "\n}\n\n"; 

        // Export modules 
        //fileStr += "module.exports = { Images, Audio, Text, Json, Xml }";


        // Write to file
        grunt.file.defaultEncoding = 'utf8';
        grunt.file.write(this.data.files.dest, fileStr); 

    }); // end task 
}; // end exports 


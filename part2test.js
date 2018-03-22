   
    var fs = require("fs");
    var inquirer = require('inquirer');
    var request = require('request');
    var cheerio = require('cheerio');
    var Artist= "Killer Mike"
    var TotalSongCount=13+15+14+14
    var ArtistUrl="https://lastfm-img2.akamaized.net/i/u/300x300/9093158d4ebd4bc197898cbaba8771d2.png"
    var lyricsbody=""
    
    formatting()
        function formatting(){
    
          fs.readFile("scrape.txt", "utf8", function(err, data) {
            if (err) {
              return console.log(err);
            }
            lyricsbody=data
            lyricsbody = lyricsbody.replace(/,/g, "");
            lyricsbody = lyricsbody.replace(/-/g, " ");
            lyricsbody = lyricsbody.replace(/'/g,"");
            lyricsbody = lyricsbody.replace(/\(/g,"");
            lyricsbody = lyricsbody.replace(/\)/g,"");
            lyricsbody = lyricsbody.replace(/\n/g, " ")
            lyricsbody = lyricsbody.replace(/\./g,"")
            lyricsbody = lyricsbody.replace(/\?/g,"")
            lyricsbody = lyricsbody.replace(/\!/g,"")
            lyricsbody = lyricsbody.replace(/\[/g,"")
            lyricsbody = lyricsbody.replace(/\]/g,"")
            lyricsbody = lyricsbody.replace(/\{/g,"")
            lyricsbody = lyricsbody.replace(/\}/g,"")
    
            fs.appendFile("output.txt", lyricsbody ,  function(err, data) {
                if (err) {
                  return console.log(err);
                }
                console.log ("Cleaned Text best we could.")
                console.log("Wrote formatted Lyrics to output.text")
            
               });
              
               outputread()
            
            })
            
          }
        
            
        
        function outputread(){
    
        
            lyricsbody=lyricsbody.split(" ");
    
            //console.log(lyricsbody)
            finaloutput()
    
        }
    
    
        function finaloutput(){
          for (var i=0; i<lyricsbody.length; i++){
            lyricsbody[i]='"'+ lyricsbody[i] + '"'
          }
          var tobewritten = "{ Artist: "+Artist +", numOfSongs: "+TotalSongCount +", imgUrl: "+ ArtistUrl +", words:["+lyricsbody+"]}"        
        fs.writeFile(Artist+".txt", tobewritten, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("Wrote to "+ Artist+".txt")
    })
        }
      
    
    
    
var fs = require("fs");
var inquirer = require('inquirer');
var request = require('request');
var cheerio = require('cheerio');
var Artist = "Death-Grips"
var Song = "Beware"
var LastFmAPIKey = "522040999d6813df673088a0da52fadd&"
var ScrapeContainer=[]
var AlbumsArray = []
var SongsArray = []
var Artist="";
var TotalSongCount=0
var ArtistUrl=""
var lyricsbody=""
var Scrape= function(){
  this.Artist="";
  this.AlbumName="";
  

  this.addData = function(Artist, AlbumName, Tracks){
    this.Artist=Artist;
    this.AlbumName=AlbumName;
    this.Tracks=Tracks
    
  }
}


function1()
function function1(){


//   inquirer.prompt([{
    

//     type: "input",
//       name: "Artist",
//       message: "Which artist would you like to search?"}
//     ]).then(function(user) {
//       Artist = user.Artist
    console.log(user.Artist) // user. Artist will output in the format for scraping
    Artist="Tyler the creator" //Uncomment and fill in this variable if you want to manually input the artist and not type it
    request.get("https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist="+Artist+"&&api_key="+LastFmAPIKey+"&format=json", function(error, response, body) {
      
    if (!error && response.statusCode === 200) {
      
  
      let json = JSON.parse(body);
      ArtistUrl=json.topalbums.album[0].text
      for (var i =0; i<7; i++){
        //console.log(json.topalbums.album[i].name)
        AlbumsArray.push(json.topalbums.album[i].name)
        

        
        // From here we want to go ahead and get The first lets do 7 albums
        // Push them into a multi demensional array. So its Albums in the top row and then tracks.
      }
      console.log(AlbumsArray)
      function3()
    }
    
  });


}
// Initially wanted to use this maybe another time
// function function2(){
  

//   inquirer.prompt([{
//     type: "list",
//     choices: ["Yes", "No"],
//     name: "choice",
//     message: "Looking at the results from the API, does that look right to you? (Duplicate albums dont matter)"
// }, ]).then(function(user) {

//     if( user.choice="No"){
//       
//     } else {
//       function3()
// }
// })
// }

var RecursionCounter=0;
function function3(){
      request.get("https://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist="+Artist+"&&api_key="+LastFmAPIKey+"&album="+AlbumsArray[RecursionCounter]+"&format=json", function(error, response, body) {
        if (!error && response.statusCode === 200) {
          SongsArray= []
      
          let json = JSON.parse(body);
            
            // Push them into a multi demensional array. So its Albums in the top row and then tracks.
        for (var i =0; i<json.album.tracks.track.length; i++) {
          //console.log(json.album.tracks.track[i].name)
          
          var CleanedText = json.album.tracks.track[i].name
          CleanedText = CleanedText.replace(/,/g, "");
          CleanedText = CleanedText.replace(/-/g, " ");
          CleanedText = CleanedText.replace(/'/g,"");
          CleanedText = CleanedText.replace(/\(/g,"");
          CleanedText = CleanedText.replace(/\)/g,"");
          CleanedText = CleanedText.replace(/\n/g," ")
          CleanedText = CleanedText.replace(/\./g,"")
          CleanedText = CleanedText.replace(/\?/g,"")
          CleanedText = CleanedText.replace(/\!/g,"")
          SongsArray.push(CleanedText)
          //console.log(SongsArray)
        }
           // Then we want to scrape for all the tracks and the albums from musixmatch as a big ol fuck you
           //console.log(AlbumsArray)
           //console.log(SongsArray)
           
           
          
           switch(RecursionCounter) {
            case 0:
            var Scrape0 = new Scrape()
            Scrape0.addData(Artist ,AlbumsArray[0],SongsArray)
            ScrapeContainer.push(Scrape0)
                break;
            case 1:
            var Scrape1 = new Scrape()
            Scrape1.addData(Artist ,AlbumsArray[1],SongsArray)
            ScrapeContainer.push(Scrape1)
                break;
                case 2:
                var Scrape2 = new Scrape()
            Scrape2.addData(Artist ,AlbumsArray[2],SongsArray)
            ScrapeContainer.push(Scrape2)
                break;
            case 3:
            var Scrape3 = new Scrape()
            Scrape3.addData(Artist ,AlbumsArray[3],SongsArray)
            ScrapeContainer.push(Scrape3)
                break;
                case 4:
                var Scrape4 = new Scrape()
            Scrape4.addData(Artist ,AlbumsArray[4],SongsArray)
            ScrapeContainer.push(Scrape4)
                break;
            case 5:
            var Scrape5 = new Scrape()
            Scrape5.addData(Artist ,AlbumsArray[5],SongsArray)
            ScrapeContainer.push(Scrape5)
                break;
                case 6:
                var Scrape6 = new Scrape()
            Scrape6.addData(Artist ,AlbumsArray[6],SongsArray)
            ScrapeContainer.push(Scrape6)
                break;   
        } 
        RecursionCounter++
        console.log(RecursionCounter)
        if (RecursionCounter<6){
          function3()
        } else {
         
          
          console.log(ScrapeContainer[0].AlbumName)
          console.log(ScrapeContainer[0].Artist)
          console.log(ScrapeContainer[0].Tracks)
          
          ObtainLyricsDisregardCurrency()
        }
              }
              
    
              
    })
    
    }
var AlbumCounter=0
var TrackCounter=0
var exit = 0;

function ObtainLyricsDisregardCurrency() {
  if (ScrapeContainer[AlbumCounter].Artist!=undefined && ScrapeContainer[AlbumCounter].Tracks[TrackCounter]!=undefined){
  var ScrapeArtist = ScrapeContainer[AlbumCounter].Artist.replace(/\s/g, "-"); // There may be an issue with artists with multiple spaces in their name (/" "/g, "-"); doesnt seem to work
  
  var ScrapeSong = ScrapeContainer[AlbumCounter].Tracks[TrackCounter].replace(/\s/g, "-");
  request("https://www.musixmatch.com/lyrics/" + ScrapeArtist + "/" + ScrapeSong, function(err, resp, html) {
      if (!err) {
          const $ = cheerio.load(html);
          var test = $('.mxm-lyrics__content ').text()
          //console.log(test)
          // var test = "https://www.musixmatch.com/lyrics/"+ScrapeArtist+"/"+ScrapeSong
          console.log(ScrapeSong +"+"+ ScrapeArtist +"+ TrackCounter: "+TrackCounter )
          fs.appendFile("scrape.txt", test, function(err, data) {
              if (err) {
                  return console.log(err);
              }
              console.log("Wrote to scrape.txt")
              TrackCounter++
              console.log("New Tracker Count: "+ TrackCounter)
              console.log("Album Length"+ ScrapeContainer[AlbumCounter].Tracks.length)
              if (TrackCounter === ScrapeContainer[AlbumCounter].Tracks.length) {

                //console.log("Entered Album Increment Loop")
                
                  TrackCounter = 0;
                  AlbumCounter++
                  if (AlbumCounter === 6) {
                      exit = 1;
                  } else {
                    callback()
                  }
                  
            } else {
              callback()
            }
    
          
          })
          
          
      }

  });
}
}
    function callback(){
       if (exit===0){
        ObtainLyricsDisregardCurrency() 
       } else {
         console.log ("entered else condition")
         // we're going to count tracks
         for (var i=0; i<ScrapeContainer[i].Tracks.length; i++){
          TotalSongCount = TotalSongCount + ScrapeContainer[AlbumCounter].Tracks.length
          console.log("Song count across albums: "+TotalSongCount)
          
         }
         
         formatting()
       }
      
    }
    
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
      fs.readFile("output.txt", "utf8", function(err, data) {
        if (err) {
          return console.log(err);
        }
    
        lyricsbody=data.split(" ");
        //console.log(lyricsbody)
        finaloutput()
})
    }


    function finaloutput(){
      var tobewritten = "{ Artist: "+Artist +", numOfSongs: "+TotalSongCount +", imgUrl: "+ ArtistUrl +", words:["+lyricsbody+"]}"
        
    fs.writeFile(Artist+".txt", tobewritten, function(err) {
        if(err) {
            return console.log(err);
        }
      
})
    }







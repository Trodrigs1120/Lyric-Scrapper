var fs = require("fs");
var inquirer = require('inquirer');
var request = require('request');
var cheerio = require('cheerio');
var Artist = ""
var Song = ""
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
  inquirer.prompt([{
    type: "input",
      name: "Artist",
      message: "Which artist would you like to search?"}
    ]).then(function(user) {
      Artist = user.Artist
    console.log(user.Artist) // user. Artist will output in the format for scraping
//    Artist="" Uncomment and fill in this variable if you want to manually input the artist and not type it
    request.get("https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist="+Artist+"&&api_key="+LastFmAPIKey+"&format=json", function(error, response, body) {
      
    if (!error && response.statusCode === 200) {
      let json = JSON.parse(body);
      ArtistUrl=json.topalbums.album[0].text
      for (var i =0; i<7; i++){
        AlbumsArray.push(json.topalbums.album[i].name)
        // From here we want to go ahead and get The first lets do 6 albums
        // We push them into the albums array and then put that into the scrape object so we can keep track of our albums and tracks
      }
      console.log(AlbumsArray)
      function2()
    }
    
  });
});

}
// You will be able to see the response from last.fm's albums, if the albums don't look familiar you can hit no to type in the name again
// note that some artists will work and some will not, we're banking on musix-match being consistent with their page url formats and last.fm to not have any oddities 
function function2(){
  inquirer.prompt([{
    type: "list",
    choices: ["Yes", "No"],
    name: "choice",
    message: "Looking at the results from the API, does that look right to you? (IF YOU HAVENT BACKED UP YOUR SCRAPE.TXT PLEASE DO SO)"
}, ]).then(function(user) {

    if( user.choice==="No"){
      function1()
    } else {
      //writing blank scrape so that you don't accidentially combined artists lyrics
      fs.writeFile('scrape.txt',(err) => {  
        // throws an error, you could also catch it here
        if (err) throw err;
    });
      function3()
}
})
}

var RecursionCounter=0;
function function3(){
      request.get("https://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist="+Artist+"&&api_key="+LastFmAPIKey+"&album="+AlbumsArray[RecursionCounter]+"&format=json", function(error, response, body) {
        if (!error && response.statusCode === 200) {
          SongsArray= []
          let json = JSON.parse(body);
        for (var i =0; i<json.album.tracks.track.length; i++) {
          var CleanedText = json.album.tracks.track[i].name
          CleanedText = CleanedText.replace(/,/g, "");
          CleanedText = CleanedText.replace(/-/g, " ");
          CleanedText = CleanedText.replace(/'/g,"");
          CleanedText = CleanedText.replace(/\(/g,"");
          CleanedText = CleanedText.replace(/\)/g,"");
          CleanedText = CleanedText.replace(/\n/g," ")
          CleanedText = CleanedText.replace(/\r/g," ")
          CleanedText = CleanedText.replace(/\./g,"")
          CleanedText = CleanedText.replace(/\?/g,"")
          CleanedText = CleanedText.replace(/\!/g,"")
          SongsArray.push(CleanedText)

        }
        // Picks the scrape depending on which step we are on. Then inserts our tracks and album into that object
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
    //Track counter and album counter will tick up as the scrapes go, when its finished the last album and last track it will then exit
var AlbumCounter=0
var TrackCounter=0
var exit = 0;
//This is where the scraping actually happens, everything up to this point was just gathering information from last.fm
function ObtainLyricsDisregardCurrency() {
  if (ScrapeContainer[AlbumCounter].Artist!=undefined && ScrapeContainer[AlbumCounter].Tracks[TrackCounter]!=undefined){
  var ScrapeArtist = ScrapeContainer[AlbumCounter].Artist.replace(/\s/g, "-"); // There may be an issue with artists with multiple spaces in their name (/" "/g, "-"); doesnt seem to work
  
  var ScrapeSong = ScrapeContainer[AlbumCounter].Tracks[TrackCounter].replace(/\s/g, "-");
  request("https://www.musixmatch.com/lyrics/" + ScrapeArtist + "/" + ScrapeSong, function(err, resp, html) {
      if (!err) {
          const $ = cheerio.load(html);
          // they keep all the lyrics in this element on the site, so thats what wer're scrapping
          var test = $('.mxm-lyrics__content ').text()
          console.log(ScrapeSong +"+"+ ScrapeArtist +"+ TrackCounter: "+TrackCounter )
          fs.appendFile("scrape.txt", test, function(err, data) {
              if (err) {
                  return console.log(err);
              }
              console.log("Wrote to scrape.txt")
              console.log("Track "+ TrackCounter + "out of : "+ ScrapeContainer[AlbumCounter].Tracks.length)
              TrackCounter++
              if (TrackCounter === ScrapeContainer[AlbumCounter].Tracks.length) {
                  TrackCounter = 0;
                  AlbumCounter++
                  if (AlbumCounter === 6) {
                      exit = 1;
                  } else {
                    recursion()
                  }
                  
            } else {
              recursion()
            }
    
          
          })
          
          
      }

  });
}
}
    function recursion(){
       if (exit===0){
        ObtainLyricsDisregardCurrency() 
       } else {
       console.log("remember to back up your scrape before running again!")
      
         }
         
         
       }
      








console.log("Let's Write javaScript");

let currentSong = new Audio();

function secondsToMinutesSeconds(seconds) {

    // if(isNaN(seconds) || seconds <0){
    //     return "Invailid input";
    // }
    const minutes = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);

    const formattedMins = String(minutes).padStart(2, '0');
    const formattedSecs = String(sec).padStart(2, '0');

    return `${formattedMins}:${formattedSecs}`;
}


async function getSongs() {

    
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs;
}

const playMusic = (track, pause = false) =>{
    //let audio = new Audio("/songs/" +track)
    currentSong.src = "/songs/" + track;

    if(!pause){

        currentSong.play()
        play.src = "img/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {

    //let currentSong = new Audio
    //get song list
    let songs = await getSongs();

    playMusic(songs[0], true)
    
    //show songs in the songList
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="img/music.svg" alt="music">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Rishi</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="play">
                            </div> </li>`;
    }

    //attached event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element =>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    //attached an event listener to play next and previous
    play.addEventListener("click", () =>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "img/pause.svg"
        }else{
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    //listen for timeupdate event

    currentSong.addEventListener("timeupdate", () =>{
        console.log(currentSong.currentTime, currentSong.durtion)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/ ${secondsToMinutesSeconds(currentSong.duration)}`

        if (!isNaN(currentSong.duration) && currentSong.duration > 0) {
    const progressPercent = (currentSong.currentTime / currentSong.duration) * 100;
    document.querySelector(".circle").style.left = `${progressPercent}%`;
}
        // document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.durtion)*100 +"%";
    })

    // add event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e =>{
        console.log(e )
    })

    //add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () =>{
        document.querySelector(".left").style.left = "0"
    })
    //add an event listener for close button
    document.querySelector(".close").addEventListener("click", () =>{
        document.querySelector(".left").style.left = "-110%"
    })
}
main()
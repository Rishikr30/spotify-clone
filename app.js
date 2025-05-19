console.log("Let's Write javaScript");

let currentSong = new Audio();

let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {

    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);

    const formattedMins = String(minutes).padStart(2, '0');
    const formattedSecs = String(sec).padStart(2, '0');

    return `${formattedMins}:${formattedSecs}`;
}


async function getSongs(folder) {

    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    //show songs in the playList

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="img/music.svg" alt="music">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Rishi</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="play">
                            </div></li>`;
    }

    //attached event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    return songs
}

const playMusic = (track, pause = false) => {
    //let audio = new Audio("/songs/" +track)
    currentSong.src = `/${currFolder}/` + track;

    if (!pause) {

        currentSong.play()
        play.src = "img/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")

    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs")) {
            let folder = (e.href.split("/").slice(-2)[3])
            //get the meta data of the folder 

            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response)

            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
                        <div class="play">
                            <img src="img/play-button-svgrepo-com.svg" alt="play">
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="Happy Hits">
                        <h2>${response.title}</h2>
                        <p>${response.description} </p>
                    </div> `
        }
    }
    //load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log(e)
            console.log("card clicked")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
        })
    })
}


async function main() {

    //let currentSong = new Audio
    //get song list
    await getSongs("songs/mysong");

    playMusic(songs[0], true)

    //display all the album on the page
    displayAlbums()
    //attached an event listener to play next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        } else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    //listen for timeupdate event

    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.durtion)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/ ${secondsToMinutesSeconds(currentSong.duration)}`

        if (!isNaN(currentSong.duration) && currentSong.duration > 0) {
            const progressPercent = (currentSong.currentTime / currentSong.duration) * 100;
            document.querySelector(".circle").style.left = `${progressPercent}%`;
        }
        // document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.durtion)*100 +"%";
    })

    // add event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";

        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    //add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    //add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%"
    })

    //Add an event listener for previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("previous clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    //Add an event listener for next
    next.addEventListener("click", () => {
        console.log("next clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
    })


}
main()
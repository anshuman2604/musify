// image should be 1920*1200

let currfolder = "Travelling%20Playlist-%20The%20Best%20Travel%20Playlist%20For%20You"
let currentsong = new Audio("songs/Travelling%20Playlist-%20The%20Best%20Travel%20Playlist%20For%20You/Baller.mp3")
let voll
let songs = []
let song_link = []
currentsong.volume = 0.5


document.querySelector(".ham").addEventListener("click",()=>{
    document.querySelector(".left").style.left=0
})

document.querySelector(".cross").addEventListener("click",()=>{
    document.querySelector(".left").style.left=-100+"%"
})



function active(a) {
    console.log(a)
    a.style.backgroundColor = "rgba(80, 79, 79, 0.111)";

}




function secondsToMinutesSeconds(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);
    return minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
}


async function fetch_song() {
    let fetching = await fetch(`songs/${currfolder}`)
    let get = await fetching.text();
    let div = document.createElement("div")
    div.innerHTML = get
    let a = div.getElementsByTagName("a")
    songs = []
    song_link = []


    currentsong.addEventListener("timeupdate", e => {
        document.querySelector(".player_song_duration").innerHTML = secondsToMinutesSeconds(currentsong.currentTime) + " / " + secondsToMinutesSeconds(currentsong.duration)
        if (currentsong.currentTime == currentsong.duration && song_link.indexOf(currentsong.src) < (songs.length) - 1) {
            let index = song_link.indexOf(currentsong.src)
            playmusic(songs[index + 1], song_link[index + 1])
        }
        else if (currentsong.currentTime == currentsong.duration && song_link.indexOf(currentsong.src) >= (songs.length) - 1) {
            play.src = "playsong.svg"
            playmusic(songs[0], song_link[0])
        }
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })



    for (const i of a) {
        if (i.title.endsWith(".mp3")) {
            let z = i.title.replace(".mp3", " ")
            songs.push(z)
        }

    }
    for (const j of a) {
        if (j.title.endsWith(".mp3")) {
            song_link.push(j.href)
        }

    }


    let library = document.querySelector(".library-songs ul")
    library.innerHTML = ""
    for (let k = 0; k < songs.length; k++) {
        library.innerHTML = library.innerHTML + `<li><span>${song_link[k]}</span><img src="music.svg" alt="icon"><p>${songs[k]}</p></li>`
    }




    volume.addEventListener("change", e => {
        let v = (e.target.value) / 100
        voll = v
        currentsong.volume = voll
    })





    // gets li that was clicked
    Array.from(document.querySelector(".library-songs").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            let f = e.getElementsByTagName("span")[0]
            let g = e.getElementsByTagName("p")[0]
            play.src = "pause.svg"
            playmusic(g.innerHTML, f.innerHTML)
        })
    });


    // seekbar functioning

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width)
        currentsong.currentTime = (currentsong.duration) * percent
    })


}


async function get_playlist() {
    let folder_fetch = await fetch("songs/");
    let t = await folder_fetch.text();
    let div = document.createElement("div");
    div.innerHTML = t;
    let playlist = document.querySelector(".playlist");

    for (const e of div.getElementsByTagName("a")) {
        if (e.title.length >= 3) {
            let titles = e.title;
            let images;

            let parts = titles.split("-");
            let firstPart = parts[0].trim();
            let secondPart = parts[1].trim();

            let fetch_image = await fetch(`songs/${titles}`);
            let t = await fetch_image.text();
            let imageDiv = document.createElement("div");
            imageDiv.innerHTML = t;
            for (const imgElement of imageDiv.getElementsByTagName("a")) {
                if (imgElement.title.endsWith(".jpg")) {
                    images = imgElement.title;

                }
            }
            playlist.innerHTML += `<div class="cards">
                <div class="card-image">
                    <img src="songs/${titles}/${images}" alt="Thumbnail" title="${titles.replaceAll(" ", "%20")}">
                    <div class="card-button"><img src="play.svg" alt="icon"></div>
                </div>
                <div class="card-content">
                    <h3>${firstPart}</h3>
                    <p>${secondPart}</p>
                </div>
            </div>`;
        }
    }
}

async function ansh() {
    await get_playlist();
    document.querySelectorAll(".cards").forEach(e => {
        e.addEventListener("click", async () => {
            let b = e.querySelector(".card-image")
            let folder = b.getElementsByTagName("img")[0].title
            currfolder = folder
            await fetch_song()
            document.querySelectorAll(".cards").forEach(v => {
                v.style.backgroundColor = "transparent";
            })
            active(e)
            playmusic(songs[0], song_link[0])
        })
    });
}

function playmusic(track_name, track) {
    document.querySelector(".player_song_name").innerHTML = "Song Playing: " + track_name
    currentsong.src = track
    currentsong.play()
    play.src = "pause.svg"
}

play.addEventListener("click", () => {
    if (currentsong.paused) {
        currentsong.play()
        play.src = "pause.svg"
    }
    else {
        currentsong.pause()
        play.src = "playsong.svg"
    }
})

next.addEventListener("click", () => {
    if (song_link.indexOf(currentsong.src) < (songs.length) - 1) {
        console.log(songs.length)
        let index = song_link.indexOf(currentsong.src)
        playmusic(songs[index + 1], song_link[index + 1])
        play.src = "pause.svg"
    }
    else{
        playmusic(songs[0], song_link[0])
    }

})

prev.addEventListener("click", () => {
    if (song_link.indexOf(currentsong.src) >= 1) {
        let index = song_link.indexOf(currentsong.src)
        playmusic(songs[index - 1], song_link[index - 1])
        play.src = "pause.svg"
    }

})

ansh();

fetch_song()
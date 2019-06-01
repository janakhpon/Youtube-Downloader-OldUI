// Imports/Requirements and Variable Assignments
const remote = require("electron").remote;
const { app } = require("electron").remote;

const ById = function(id) {
  return document.getElementById(id);
};

//GET PATH

const path = require("path");
const readline = require("readline");
//ASSIGN RESPECTIVE IDS

let video = ById("video"),
  audio = ById("audio"),
  view = ById("view"),
  power = ById("power"),
  reload = ById("reload"),
  backward = ById("backward"),
  forward = ById("forward"),
  vdstatus = ById("vd-status"),
  vdmb = ById("vd-mb"),
  vdpercent = ById("vd-percent"),
  vdrun = ById("vd-run"),
  vdtime = ById("vd-time"),
  vdcomplete = ById("vd-complete"),
  vdcount = ById("vd-count"),
  adstatus = ById("ad-status"),
  admb = ById("ad-mb"),
  adpercent = ById("ad-percent"),
  adrun = ById("ad-run"),
  adtime = ById("ad-time"),
  adcomplete = ById("ad-complete"),
  adcount = ById("ad-count");

const fs = require("fs"),
  ytdl = require("ytdl-core"),
  ffmpeg = require("fluent-ffmpeg");

var msgastart = "downloading audio ..",
    msgacomplete = "Saved audio to Download/",
    msgvstart = "downloading video ..",
    msgvcomplete = "Saved video to Download/",
    msgplace = "------  ------",
  msginit = ".    .  .  . . ....",
    msgcount = "0 out of 0",
    msgdefault = "no task available";

var xcount = 0;
var pcount = 0;

//Video trigerring
vdstatus.value = msgdefault;
vdmb.value = msgplace;
vdpercent.value = msgplace;
vdrun.value = msgplace;
vdtime.value = msgplace;
vdcomplete.value = msgplace;
vdcount.value = msgcount;

//Audio triggering
adstatus.value = msgdefault;
admb.value = msgplace;
adpercent.value = msgplace;
adrun.value = msgplace;
adtime.value = msgplace;
adcomplete.value = msgplace;
adcount.value = msgcount;

//Download video
function downVideo() {

  pcount++;
  let name = view.getTitle();
  const url = view.getURL();
  const output = path.resolve(
    `${app.getPath("home")}/Downloads/`,
    `${name}` + ".mp4"
  );
  const video = ytdl(url, {
    quality: "highestvideo",
    filter: "audioandvideo"
  });

  //Video trigerring
  vdstatus.value = msgvstart;
  vdpercent.value = msginit;
  vdrun.value = msginit;
  vdtime.value = msginit;
  vdcomplete.value = msginit;
  vdcount.value = msginit;
  

  var starttime;
  video.pipe(fs.createWriteStream(output));
  video.once("response", () => {
    starttime = Date.now();
  });

  video.on("progress", (chunkLength, downloaded, total) => {
    const floatDownloaded = downloaded / total;
    const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
    var vd_percentevalue = (floatDownloaded * 100).toFixed(2) + "%";
    vdpercent.value = vd_percentevalue;

    var vd_mbvalue =
      ""+
      (downloaded / 1024 / 1024).toFixed(2) +
      "MB of " +
      (total / 1024 / 1024).toFixed(2) +
      "MB";
    vdmb.value = vd_mbvalue;

    var vd_runvalue = "Running for " + downloadedMinutes.toFixed(2) + "mins";
    vdrun.value = vd_runvalue;

    var vd_timevalue =
      (downloadedMinutes / floatDownloaded - downloadedMinutes).toFixed(2) +
      "mins left";
    vdtime.value = vd_timevalue;
  });

  
  video.on("end", () => {
    vdcomplete.value = msgvcomplete;
  });

  xcount++;
  vdcount.value = ""+xcount+" out of "+pcount;
 
}

//Download audio
function downAudio() {
  const url = view.getURL();

  let name = view.getTitle();

  let start = Date.now();
  const audioOutput = path.resolve(
    __dirname,
    `${app.getPath("home")}/Downloads/${name}.m4a`
  );

  ytdl(url, {
    filter: format => {
      return format.container === "m4a" && !format.encoding;
    },
    quality: "highestaudio",
    filter: "audioonly"
  })
    .pipe(fs.createWriteStream(audioOutput))
    .on("finish", () => {
      ffmpeg()
        .on("error", console.error)
        .on("progress", progress => {
        })
        .on("end", () => {
          fs.unlink(audioOutput, err => {
            if (err) console.error(err);
            else {
            }
          });
        });
    });
}

//Move to Previous song
function goBackward() {
  view.goBack();
}

//Exit from JDOWNLOADER
function goExit() {
  app.exit(0);
}

//Move to Next song
function goNext() {
  view.goForward();
}

function goStart() {
  remote.getCurrentWindow().reload();
  adstatus.value = msgdefault;
  adstatus.value = msgplace;
  adpercent.value = msgplace;
  adrun.value = msgplace;
  adtime.value = msgplace;
  adcomplete.value = msgplace;
  adcount.value = msgplace;
}

//Assign respective values
reload.addEventListener("click", goStart);
video.addEventListener("click", downVideo);
audio.addEventListener("click", downAudio);
power.addEventListener("click", goExit);
backward.addEventListener("click", goBackward);
forward.addEventListener("click", goNext);

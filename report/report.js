// array that holds the workout info. First element is the score and second element is the time
var workoutInfoArray = []; // from URL key
var allYogaPoseInfo = []; // from workout folder, poseInfo.json
var workoutInfo = []; // from exersiceInfo.json


// read key from url
var urlParams = new URLSearchParams(window.location.search);
var workout = urlParams.get('workoutData');
var workoutName = urlParams.get('workoutName');
// strip the ' from the string
workoutName = workoutName.replace(/"/g, "");
console.log("workout name: " + workoutName);
var baseFolderLocation = '/workouts/' + workoutName;

var splitWorkout1 = workout.split("[");
var splitWorkout2 = splitWorkout1[1].split("]");
var splitWorkout3 = splitWorkout2[0].split(",");



while (splitWorkout3.length > 0) {
    workoutInfoArray.push(splitWorkout3.splice(0, 2));
}


// parse the workout info file related to workout images and their landmarks
function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', baseFolderLocation + '/poseInfo.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // .open will NOT return a value but simply returns undefined in async mode so use a callback
            callback(xobj.responseText);
        }
    }
    xobj.send(null);
}
// Call to function with anonymous callback
loadJSON(function (response) {
    // Do Something with the response e.g.
    allYogaPoseInfo = JSON.parse(response); // save json info to global variable
});

// from json file, includes image file location, name and pose angles
// parse the workout info file

function loadWorkoutInfoJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '/exerciseInfo.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // .open will NOT return a value but simply returns undefined in async mode so use a callback
            callback(xobj.responseText);
        }
    }
    xobj.send(null);
}
// Call to function with anonymous callback
var workoutImages = [];
loadWorkoutInfoJSON(function (response) {
    document.getElementById('title').innerHTML = "Review for your " + workoutInfoArray.length + " poses";
    workoutInfo = JSON.parse(response); // save json info to global variable
    for (var i = 0; i < workoutInfo.length; i++) {
        if (workoutInfo[i].Folder_name == workoutName) {
            // convert the string to an array and split it ,
            var splitWorkout = workoutInfo[i].Best_pose_image.split(",");
            for (var j = 0; j < splitWorkout.length; j++) {
                workoutImages.push(splitWorkout[j]);
            }
        }
    }
    for (var i = 0; i < workoutInfoArray.length; i++) {
        // set the number of workouts in title
        if (i == 0) {
            document.getElementById('count').innerHTML = i + 1;
            document.getElementById('avgScoreAmount').innerHTML = workoutInfoArray[i][0];
            document.getElementById('timeAmount').innerHTML = workoutInfoArray[i][1];
            console.log("workout image: " + workoutImages);
            let imageLocation = baseFolderLocation + '/' + workoutImages[i] + '.png';
            console.log("image location: " + imageLocation);
            document.getElementById('firstImage').src = imageLocation;
        }
        else {
            var original = document.getElementById("all");
            var clone = original.cloneNode(true);
            clone.id = 'workout' + i;
            document.getElementById("body").appendChild(clone);
            // change the inner html of the clone
            const parent = document.querySelector('#workout' + i);
            const childCount = document.querySelectorAll('[id=count]');
            childCount[i].innerHTML = i + 1;
            const childName = document.querySelectorAll('[id=avgScoreAmount]');
            childName[i].innerHTML = workoutInfoArray[i][0];
            const childInstructor = document.querySelectorAll('[id=timeAmount]');
            childInstructor[i].innerHTML = workoutInfoArray[i][1];
            let imageLocation = baseFolderLocation + '/' + workoutImages[i] + '.png';
            const childFirstImg = document.querySelectorAll('[id=firstImage]');
            childFirstImg[i].src = imageLocation;

        }
    }
}
);













function selectWorkout(clicked_id) {
    console.log("Button clicked " + clicked_id);
    let workout = clicked_id.split("_");
    window.location.href = '/app/index.html?workout=' + workoutInfo[workout[1]].Folder_name;
}







// Firebase config and initialization
var config = {
    apiKey: "AIzaSyCOEaUaWKISRTdhOrtnOy0QAxcA-gQq7Po",
    authDomain: "trainschedule-dd6cb.firebaseapp.com",
    databaseURL: "https://trainschedule-dd6cb.firebaseio.com",
    projectId: "trainschedule-dd6cb",
    storageBucket: "trainschedule-dd6cb.appspot.com",
    messagingSenderId: "433102358836"
};
firebase.initializeApp(config);
var database = firebase.database();
// Declaring general global variables.
var intervalID;
var trainAry = [];
// train objects.
var train = {
    name: "",
    destination: "",
    startTime: "",
    frequency: "",
    minAway: "",
    nextTrain: ""
};
var setTrain = {
    nextArrival: function (trainParam) {
        // method to calculate the arrival time of the next train, and how many minutes away it is.
        var parsedFreq = parseInt(trainParam.frequency);
        var startTimeConv = moment(trainParam.startTime, "h:mm A").format("HH:mm");
        var diffTime = moment().diff(moment(startTimeConv, "hh:mm A"), "minutes");
        var tRemainder = diffTime % parsedFreq;
        trainParam.minAway = parsedFreq - tRemainder;
        var nextTrain = moment().add(trainParam.minAway, "minutes");
        trainParam.nextTrain = moment(nextTrain).format("hh:mm A");
        return trainParam;
    },
    // method to populate the train schedule on the DOM.
    makeRow: function (trainParam) {
        var newTrain = this.nextArrival(trainParam);
        var newTr = $("<tr>").append(
            $("<td>").text(newTrain.name),
            $("<td>").text(newTrain.destination),
            $("<td>").text(newTrain.frequency),
            $("<td>").text(newTrain.nextTrain),
            $("<td>").text(newTrain.minAway),
        );
        $("#table-body").append(newTr);
    }
};

// function to push new train to database. 
var pushNewTrain = () => {
    database.ref("trains").push({
        name: $("#name-input").val().trim(),
        destination: $("#destination").val().trim(),
        startTime: $("#first-train-time").val().trim(),
        frequency: $("#frequency").val().trim(),
        minAway: "",
        nextTrain: "",
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
};
// function to clear out the train form. 
var clearVals = () => {
    $("#name-input").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val("");
}
// timer functions to update the train schedule every 15 seconds. 
var startTimer = () => {
    intervalID = setInterval(function () {
        console.log("interval going");
        $("#current-time").text(moment().format("hh:mm A"));
        $("#table-body").empty();
        for (var i = 0; i < trainAry.length; i++) {
            setTrain.makeRow(trainAry[i]);
        }
    }, 15000);
};
var stopTimer = () => {
    clearInterval(intervalID);
};
// document ready function
$(document).ready(function () {
    // displaying the current time in the Jumbotron.
    $("#current-time").text(moment().format("hh:mm A"));
    // starting timer
    startTimer();
    // firebase function to pull information from the database. triggered when a child is added to the database. 
    database.ref("trains").on("child_added", function (snapshot) {
        var sv = snapshot.val();
        var newTrain = { ...train };
        newTrain.name = sv.name;
        newTrain.destination = sv.destination;
        newTrain.startTime = sv.startTime;
        newTrain.frequency = sv.frequency;
        setTrain.makeRow(newTrain);
        // pushing to an array so that I can update the schedule every 15 seconds
        trainAry.push(newTrain);
    });

    $("#btn-submit").on("click", function (event) {
        event.preventDefault();
        pushNewTrain();
        clearVals();
        stopTimer();
        startTimer();
    });
});
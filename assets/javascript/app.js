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

var now = moment().format();
var intervalID;
var trainAry = [];
var train = {
    name: "",
    destination: "",
    startTime: "",
    frequency: "",
    nextArrival: function () {
        var parsedFreq = parseInt(this.frequency);
        var startTimeConv = moment(this.startTime, "h:mm A").format("HH:mm");
        var diffTime = moment().diff(moment(startTimeConv, "hh:mm A"), "minutes");
        var tRemainder = diffTime % parsedFreq;
        this.minAway = parsedFreq - tRemainder;
        var nextTrain = moment().add(this.minAway, "minutes");
        this.nextTrain = moment(nextTrain).format("hh:mm");
    },
    makeTr: function () {
        this.nextArrival();
        var newTr = $("<tr>").append(
            $("<td>").text(this.name),
            $("<td>").text(this.destination),
            $("<td>").text(this.frequency),
            $("<td>").text(this.nextTrain),
            $("<td>").text(this.minAway),
        );
        $("#table-body").append(newTr);
    }
};


$(document).ready(function () {
    $("#current-time").text(moment().format("hh:mm A"));
    startTimer();
    database.ref("trains").on("child_added", function (snapshot) {
        var sv = snapshot.val();
        var newTrain = train;
        newTrain.name = sv.name;
        newTrain.destination = sv.destination;
        newTrain.startTime = sv.startTime;
        newTrain.frequency = sv.frequency;
        newTrain.makeTr();
        trainAry.push(sv);
    });

    $("#btn-submit").on("click", function (event) {
        event.preventDefault();
        pushNewTrain();
        clearVals();
        stopTimer();
        startTimer();
    });

    // var intervalID = setInterval(function () {
    //     console.log("intervalID", intervalID);
    //     $("#current-time").text(moment().format("hh:mm A"));
    //     $("#table-body").empty();
    //     for (var i = 0; i < trainAry.length; i++) {
    //         var tempTrain = train;
    //         tempTrain.name = trainAry[i].name;
    //         tempTrain.destination = trainAry[i].destination;
    //         tempTrain.startTime = trainAry[i].startTime;
    //         tempTrain.frequency = trainAry[i].frequency;
    //         tempTrain.makeTr();
    //     }
    // }, 60000);

});

var pushNewTrain = () => {
    database.ref("trains").push({
        name: $("#name-input").val().trim(),
        destination: $("#destination").val().trim(),
        startTime: $("#first-train-time").val().trim(),
        frequency: $("#frequency").val().trim(),
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
};

var clearVals = () => {
    $("#name-input").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val("");
}
var startTimer = () => {
    intervalID = setInterval(function () {
        console.log("interval going");
        $("#current-time").text(moment().format("hh:mm A"));
        $("#table-body").empty();
        for (var i = 0; i < trainAry.length; i++) {
            var tempTrain = train;
            tempTrain.name = trainAry[i].name;
            tempTrain.destination = trainAry[i].destination;
            tempTrain.startTime = trainAry[i].startTime;
            tempTrain.frequency = trainAry[i].frequency;
            tempTrain.makeTr();
        }
    }, 1000);
};
var stopTimer = () => {
    clearInterval(intervalID);
};

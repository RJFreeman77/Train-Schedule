var config = {
    apiKey: "AIzaSyCOEaUaWKISRTdhOrtnOy0QAxcA-gQq7Po",
    authDomain: "trainschedule-dd6cb.firebaseapp.com",
    databaseURL: "https://trainschedule-dd6cb.firebaseio.com",
    projectId: "trainschedule-dd6cb",
    storageBucket: "trainschedule-dd6cb.appspot.com",
    messagingSenderId: "433102358836"
};
firebase.initializeApp(config);
moment().format();
var database = firebase.database();
var trainAry = [];

var train = {
    name: "",
    destination: "",
    startTime: "",
    frequency: "",
    makeTr: function () {
        var newTr = $("<tr>").append(
            $("<td>").text(this.name),
            $("<td>").text(this.destination),
            $("<td>").text(this.frequency),
        );
        $("#table-body").append(newTr);
    },
};


$(document).ready(function () {
    $("#btn-submit").on("click", function (event) {
        event.preventDefault();
        pushNewTrain();
        clearVals();
    });

    database.ref("trains").on("child_added", function (snapshot) {
        var sv = snapshot.val();
        var newTrain = train;
        newTrain.name = sv.name;
        newTrain.destination = sv.destination;
        newTrain.startTime = sv.startTime;
        newTrain.frequency = sv.frequency;
        newTrain.makeTr();

    });

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
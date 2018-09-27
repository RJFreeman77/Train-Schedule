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

var train = {
    name: "",
    destination: "",
    startTime: "",
    frequency: "",
    makeTr: function () {
        var newTr = $("<tr>");
        var nameTd = $("<td>");
        var destTd = $("<td>");
        var freqTd = $("<td>");
        var nextArrTd = $("<td>");
        var minAwayTd = $("<td>");
        nameTd.text(this.name);
        destTd.text(this.destination);
        freqTd.text(this.frequency);
        newTr.append(nameTd).append(destTd).append(freqTd);
        $("#table-body").append(newTr);
    }
};
var trainAry = [];

$(document).ready(function () {
    console.log(trainAry);
    $("#btn-submit").on("click", function (event) {
        event.preventDefault();
        setNewTrain();
        $(".form-group").val("");
    });

});



var setNewTrain = () => {
    var newTrain = train;
    newTrain.name = $("#name-input").val().trim();
    newTrain.destination = $("#destination").val().trim();
    newTrain.startTime = $("#first-train-time").val().trim();
    newTrain.frequency = $("#frequency").val().trim();
    console.log(newTrain);
    newTrain.makeTr();
    trainAry.push(newTrain);
    console.log(trainAry);
};
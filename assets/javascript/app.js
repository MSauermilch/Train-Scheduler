$(document).ready(function(){

    //Firebase DB Credentials
    var config = {
        apiKey: "AIzaSyC9wFjYMhsAAo6_3H4jUBQcIMhQ475xZg4",
        authDomain: "train-scheduler-12178.firebaseapp.com",
        databaseURL: "https://train-scheduler-12178.firebaseio.com",
        projectId: "train-scheduler-12178",
        storageBucket: "train-scheduler-12178.appspot.com",
        messagingSenderId: "293762644133",
        appId: "1:293762644133:web:6b40ab7cb0f90dcb"
      };
    firebase.initializeApp(config);

    // Variable to reference the database.
    var database = firebase.database();
    
    // Variables to store our train info.
    var trainNum = 0;
    var destination;
    var firstTrain;
    var frequency = 0;
 
    // "On-click" event to submit a train to schedule.
    $("#add-train").on("click", function() {
        event.preventDefault();

        // Creates a Train# to identify trains instead of names
        function createTrainNum(){
                trainNum = (Math.floor(Math.random() * 9999))
                };

        createTrainNum();

        console.log("#" + trainNum);

        // grabs input
        destination = $("#destination").val().trim();
        firstTrain = $("#first-train").val().trim();
        frequency = $("#frequency").val().trim();

        // Pushs to database
        database.ref().push({
            trainNum: trainNum,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("form")[0].reset();
    });

    // Moment js using our information to format our train times.
    database.ref().on("child_added", function(childSnapshot) {
        var minAway;
        // Chang year so first train comes before now
        var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
        // Difference between the current and firstTrain
        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = diffTime % childSnapshot.val().frequency;
        // Minutes until next train
        var minAway = childSnapshot.val().frequency - remainder;
        // Next train time
        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        // Populates our schedule
        $("#add-row").append("<tr><td>" + "#" + childSnapshot.val().trainNum +
                             "</td><td>" + childSnapshot.val().destination +
                             "</td><td>" + childSnapshot.val().frequency +
                             "</td><td>" + nextTrain + 
                             "</td><td>" + minAway + "</td></tr>");

        // Handle the errors if any occer
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
    });

});
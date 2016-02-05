require("./lib/social");
require("./lib/ads");
var track = require("./lib/tracking");

var $ = require("jquery");
var Share = require("share");
var shuffle = require("lodash.shuffle");

var ich = require("icanhaz");
var questionTemplate = require("./_questionTemplate.html");
ich.addTemplate("questionTemplate", questionTemplate);
var resultTemplate = require("./_resultTemplate.html");
ich.addTemplate("resultTemplate", resultTemplate);
var overviewTemplate = require("./_overviewTemplate.html");
ich.addTemplate("overviewTemplate", overviewTemplate);

var score = 0;
var id = 1;
var total = 0;

new Share(".share-button", {
  description: "Are you a super fan of the 49ers or Raiders? Here’s your chance to prove it.",
    ui: {
    flyout: "top center"
  },
  networks: {
    email: {
      description: "Are you a super fan of the 49ers or Raiders? Here’s your chance to prove it." + window.location
    }
  }
});

$(".quiz-box").on("click", "input", (function(){
  $(".submit").addClass("active");
  $(".submit").attr("disabled", false);
}));

$(".quiz-container").on("click", ".next", function() {
  window.location = "#quiz";
  if (id < Object.keys(quizData).length) {
    // move on to next question
    id++;
    showQuestion(id);
    $(".next").removeClass("active");
    $(".next").attr("disabled", true);
  } else {
    calculateResult();
  }
});

var showQuestion = function(questionId) {
  //create new question from template
  if (questionId != 1 && questionId != 2 && questionId != 8 && questionId != 10) {
    var sorted_answers = shuffle(quizData[id].answers);
  } else {
    var sorted_answers = quizData[id].answers;
  }
  quizData[id].answers = sorted_answers;
  $(".question-box").html(ich.questionTemplate(quizData[id]));
  $(".index").html(id + " of " + Object.keys(quizData).length);
};

$(".quiz-container").on("click", ".submit", function() {

  // score answer
  var answerData = {};
  answerData.answer = quizData[id].answer;
  var correct = $("input:checked").val();
  total +=1;
  if (correct) {
    score += 1;
    answerData.hooray = true;
  }
  console.log(total);
  console.log(score);
  var q = quizData[id];
  answerData.image = q.finalImage;
  answerData.summary = q.summary;
  answerData.storyurl = q.storyurl;
  answerData.caption = q.caption;

  console.log(answerData);
  $(".question-box").html(ich.resultTemplate(answerData));
  $(".index").html(id + " of " + Object.keys(quizData).length);

  // Change button text on last question
  if (id == Object.keys(quizData).length) {
    $(".next").html("See results");
  }
  window.location = "#quiz";
});

var calculateResult = function() {
  for (var index in resultsData) {
    var result = resultsData[index];
    //move on if we don't match this category
    if (score < result.min * 1 || score > result.max * 1) continue;

    result.score = score;
    // display result
    result.score = score;
    if (result.score > 10) {
      result.color = "#589040"
    } else if (result.score > 5) {
      result.color = "#F5AE3F"
    } else {
      result.color = "#DE5636"
    }

    result.total = total;
    result.rows = rows;
    console.log(result);

    $(".question-box").html(ich.overviewTemplate(result));
    window.location = "#quiz";

    new Share(".share-results", {
      description: "I scored " + result.score + "/" + result.total + "! Are you a super fan of the 49ers or Raiders? Here’s your chance to prove it.",
        ui: {
          flyout: "top center"
        },
        networks: {
          email: {
            description: "I scored " + result.score + "/" + result.total + "! Are you a super fan of the 49ers or Raiders? Here’s your chance to prove it." + window.location
          }
        }
      }
    );
  }
};

showQuestion(id);
console.log(id);

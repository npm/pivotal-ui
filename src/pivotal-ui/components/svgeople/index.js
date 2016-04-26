var $ = require('jquery');
require('@npmcorp/pui-css-forms').stepper;

/**
 * SVGeople constructor takes 4 arguments
 * el - the element that the svgeople component is based on
 * amountOfPeopleFiles - the amount of expected svg files to transition in (default: 10)
 * shownCount - the starting amount of svgs shown (default: 1)
 * root - the root directory for the image files
 */
var SVGeople = function(el, amountOfPeopleFiles, shownCount, root) {

  this.el = $(el);
  this.root = root || this.el.data("asset-root") || "/static/images/";
  amountOfPeopleFiles = amountOfPeopleFiles || this.el.data("amount-people-files") || 10;
  this.shownCount = shownCount || this.el.data("starting-count") || 1;

  this.peopleFiles = [];
  for (var i = 0; i < amountOfPeopleFiles; i++) {
    this.peopleFiles.push(this.root + "people_p" + i + ".svg");
  }
};

/**
 * addPerson adds an svgerson into the visible context of the component from
 * the hidden container.
 *
 * idx - the index of the svgerson, e.g. if there are 10, 9 would be the final
 * index value
 */
SVGeople.prototype.addPerson = function(idx) {
  var id = "#svgerson_" + idx;
  this.el.find(id).addClass("show");
  this.el.trigger("SVGeople:personAdded", [id]);
};


/**
 * removePerson removes an svgerson from the visible context of the component to
 * the hidden container.
 *
 * idx - the index of the svgerson, e.g. if there are 10, 9 would be the final
 * index value
 */
SVGeople.prototype.removePerson = function(idx) {
  var id = "#svgerson_" + idx;
  this.el.find(id).removeClass("show");
  this.el.trigger("SVGeople:personRemoved", [id]);
};

/**
 * getPeople makes a request for each of the files listed in this.peopleFiles
 * and returns their content
 *
 * returns a $.Deferred object that will resolve when all of the $.ajax requests
 * are completed, the callback function for this object will handle each resolved
 * ajax request as a separate argument
 *
 */
SVGeople.prototype.getPeople = function() {
  var gotPeople = this.peopleFiles.map(function(personFile) {
    return $.ajax({
      url: personFile,
      method: "GET"
    })
      .then(function(data) {
        return data.documentElement.outerHTML;
      });
  });
  return $.when.apply(null, gotPeople);
};


/**
 * addPeopleToContainer takes arguments of svgerson objects (inline svg objects), and
 * adds them to the actual container on the page. When added, they are hidden.
 *
 * The reason this takes arguments is due to the way that $.when works for jQuery, namely:
 *
 * > The arguments passed to the doneCallbacks provide the resolved values for each of the
 * > Deferreds, and matches the order the Deferreds were passed to jQuery.when()
 *
 * Since addPeopleToContainer follows a function that returns a jQuery Deferred object
 * that works in this manner, this works around that problem.
 *
 */
SVGeople.prototype.addPeopleToContainer = function() {
  var people = Array.prototype.map.call(arguments, function(person, idx) {
    return "<div class='person-container' id='svgerson_" + idx + "'>" +
      person +
      "</div>";
  }).join('');

  this.el.html(people);
};

/**
 * populate is an aggregate function that exists strictly to make the usage of
 * this component a little easier to read.
 *
 * It gets all of the svg file contents, it adds them to the container, then it
 * adds the appropriate amount of people
 *
 */
SVGeople.prototype.populate = function() {
  this.el.trigger("SVGeople:populated:before");

  this.getPeople()
    .then(this.addPeopleToContainer.bind(this))
    .then(this.changePeopleShown.bind(this, this.shownCount))
    .done(this.el.trigger.bind(this.el, "SVGeople:populated"))
    .fail(console.log);
};

/**
 * changePeopleShown is a function that changes the number of visible people
 * in the container
 *
 * number - an integer counting the amount of people you want shown
 *
 */
SVGeople.prototype.changePeopleShown = function(number) {
  var peopleShown = $(".svgeople .show");
  var diff = 0;
  var i = 0;
  if (number > peopleShown.length) {
    diff = number - peopleShown.length;

    for (i = 0; i < diff; i++) {
      this.addPerson(peopleShown.length + i);
    }
  } else {
    diff = peopleShown.length - number;

    for (i = diff; i > 0; i--) {
      this.removePerson(peopleShown.length - i);
    }

  }
};

$(function() {
  var el = $('.svgeople');

  var svgeople = new SVGeople(el);
  svgeople.populate();

  /**
   * This is a tie in to the formstepper currently. It's a one-way dependency that is
   * included in the require at the top of this file to force builds to respect
   * it in browserify/webpack
   */
  $(document).on("FormStepper:changed", function(e, number) {
    svgeople.changePeopleShown(number);
  });
});

module.exports = SVGeople;

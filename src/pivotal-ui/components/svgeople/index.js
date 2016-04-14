var $ = require('jquery');
require('@npmcorp/pui-css-forms').stepper;

var SVGeople = function(el, amountOfPeopleFiles, shownCount, root) {

  this.el = $(el);
  this.root = root || this.el.data("asset-root") || "/static/images/";
  amountOfPeopleFiles = amountOfPeopleFiles || this.el.data("amount-people-files") || 10;
  this.shownCount = shownCount || this.el.data("starting-count") || 1;

  this.peopleFiles = [];
  for (var i = 0; i < amountOfPeopleFiles; i++) {
    this.peopleFiles.push(this.root + "people_p" + i + ".svg");
  }

  this.people = [];
};

SVGeople.prototype.addPerson = function(idx) {
  var id = "#svgerson_" + idx;
  this.el.find(id).addClass("show");
  this.el.trigger("SVGeople:personAdded", [id]);
};

SVGeople.prototype.removePerson = function(idx) {
  var id = "#svgerson_" + idx;
  this.el.find(id).removeClass("show");
  this.el.trigger("SVGeople:personRemoved", [id]);
};

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

SVGeople.prototype.fillPeople = function() {
  var args = Array.prototype.slice.call(arguments);
  this.people.push.apply(this.people, args);
  this.el.trigger("SVGeople:filled");
};

SVGeople.prototype.addPeopleToContainer = function() {
  var people = this.people.map(function(person, idx) {
    return "<div class='person-container' id='svgerson_" + idx + "'>" +
      person +
      "</div>";
  }).join('');

  this.el.html(people);
  this.el.trigger("SVGeople:peopleAddedToContainer");
};

SVGeople.prototype.populate = function() {
  this.el.trigger("SVGeople:populated:before");

  this.getPeople()
    .then(this.fillPeople.bind(this))
    .then(this.addPeopleToContainer.bind(this))
    .then(this.el.trigger.bind(this.el, "SVGeople:populated"))
    .done(this.changePeopleShown.bind(this, this.shownCount))
    .fail(console.log);
};

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

  $(document).on("FormStepper:changed", function(e, number) {
    svgeople.changePeopleShown(number);
  });
});

module.exports = SVGeople;

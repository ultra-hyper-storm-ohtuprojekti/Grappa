"use strict";

const BaseModel = require("./BaseModel");

class Grader extends BaseModel {
  constructor() {
    super("Grader");
  }

  updateOrCreateAndLinkToThesis(values, thesis) {
    return this.getModel()
      .findOne({ where: { id: values.id } })
      .then(foundGrader => {
        if (foundGrader === null) {
          return this.getModel().create(values);
        } else {
          return this.getModel().update(values, { where: { id: values.id } });
        }
      })
      .then(updatedGrader => updatedGrader.addThesis(thesis));
  }

  findOrCreate(grader) {
    return this.getModel()
      .findOne({ where: { name: grader.name, title: grader.title } })
      .then((newgrader) => {
        if (newgrader === null) {
          return this.getModel().create({ name: grader.name, title: grader.title });
        }
        return newgrader;
      });
  }

  linkThesisToGraders(graders, thesis) {
    if (graders === undefined) {
      return Promise.resolve();
    }
    return Promise.all(graders.map(grader => {
      return this.getModel()
          .findOne({ where: { id: grader.id } })
          .then(grader => grader.addThesis(thesis));
    }))
      .then(() => {
        console.log("Thesis and Graders all linked!");
      });
  }
}

module.exports.class = Grader;
module.exports = new Grader();
const mongoose = require('mongoose');
const _ = require('lodash');
// const WorkCategory = mongoose.model('WorkCategory');
const responseHelper = require('../../helpers/response.helper');


module.exports.create_work_category = (req, res, next) => {
  var work = new WorkCategory();
  work.name = req.body.name;
  work.type = req.body.type;
  work.description = req.body.description;
  work.save().then(category => {
    responseHelper.successResponse(res, null, 'Category created successfully.', category);
  }).catch(err => {
    responseHelper.errorResponse(res, null, 'Can\'t create category.', err);
  });
};

module.exports.get_work_categories = (req, res, next) => {
  WorkCategory.find({}).exec().then(categories => {
    responseHelper.successResponse(res, null, 'All categories fetched successfully.', categories);
  }).catch(err => {
    responseHelper.errorResponse(res, null, 'Can\'t fetch categories.', err);
  });
};

module.exports.edit_work_category = (req, res, next) => {
  WorkCategory.findById(req.params.work_id).exec().then(category => {
    responseHelper.successResponse(res, null, 'Category fetched successfully.', category);
  }).catch(err => {
    responseHelper.errorResponse(res, null, 'Can\'t fetch categories.', err);
  });
};

module.exports.update_work_category = (req, res, next) => {
  WorkCategory.findByIdAndUpdate(req.body.work_id, {
    name: req.body.name,
    description: req.body.description
  }, {
    new: true
  }).exec().then(category => {
    responseHelper.successResponse(res, null, 'Category update successfully.', category);
  }).catch(err => {
    responseHelper.errorResponse(res, null, 'Can\'t update categories.', err);
  });
};

module.exports.delete_work_category = (req, res, next) => {
  WorkCategory.delete({
    _id: req.body.work_id
  }, req.body._id).exec().then(category => {
    responseHelper.successResponse(res, null, 'Record deleted successfully..', {
      _id: req.body.work_id
    });
  }).catch(err => {
    responseHelper.errorResponse(res, null, 'Can\'t delete categories.', err);
  });
};

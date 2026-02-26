'use strict';

const asyncHandler = require('../../utils/asyncHandler');
const { sendSuccess, sendPaginated } = require('../../utils/response');
const watchService = require('./watch.service');

const getAllWatches = asyncHandler(async (req, res) => {
  const result = await watchService.getAllWatches(req.query);
  return sendPaginated(res, result.data, result, 'Watches retrieved successfully.');
});

const getWatchById = asyncHandler(async (req, res) => {
  const watch = await watchService.getWatchById(req.params.id);
  return sendSuccess(res, watch, 'Watch retrieved successfully.');
});

const getFeaturedWatches = asyncHandler(async (req, res) => {
  const watches = await watchService.getFeaturedWatches();
  return sendSuccess(res, watches, 'Featured watches retrieved.');
});

const searchWatches = asyncHandler(async (req, res) => {
  const result = await watchService.searchWatches(req.query);
  return sendPaginated(res, result.data, result, 'Search results.');
});

const createWatch = asyncHandler(async (req, res) => {
  const watch = await watchService.createWatch(req.body);
  return sendSuccess(res, watch, 'Watch created successfully.', 201);
});

const updateWatch = asyncHandler(async (req, res) => {
  const watch = await watchService.updateWatch(req.params.id, req.body);
  return sendSuccess(res, watch, 'Watch updated successfully.');
});

const deleteWatch = asyncHandler(async (req, res) => {
  await watchService.deleteWatch(req.params.id);
  return sendSuccess(res, null, 'Watch deleted successfully.');
});

const uploadWatchImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return sendSuccess(res, [], 'No files uploaded.');
  }
  const urls = await watchService.uploadWatchImages(req.params.id, req.files);
  return sendSuccess(res, { urls }, 'Images uploaded successfully.', 201);
});

module.exports = {
  getAllWatches,
  getWatchById,
  getFeaturedWatches,
  searchWatches,
  createWatch,
  updateWatch,
  deleteWatch,
  uploadWatchImages,
};

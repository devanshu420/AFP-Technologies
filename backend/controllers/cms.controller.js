// import Homepage from '../models/Homepage.js';
// import AboutPage from '../models/AboutPage.js';
// import Navigation from '../models/Navigation.js';
// import WebsiteSettings from '../models/WebsiteSettings.js';
// import SEOSettings from '../models/SEOSettings.js';
// import Advertisement from '../models/Advertisement.js';
// import { successResponse, errorResponse } from '../utils/response.js';

// // Generic helper for singletons
// async function handleGetSingleton(Model, res) {
//   try {
//     let data = await Model.findOne().lean();
//     if (!data) data = await Model.create({});
//     return successResponse(res, data);
//   } catch (err) {
//     return errorResponse(res, err.message, 500);
//   }
// }

// async function handleUpdateSingleton(Model, req, res, message) {
//   try {
//     const updated = await Model.findOneAndUpdate({}, req.body, { new: true, upsert: true });
//     return successResponse(res, updated, message);
//   } catch (err) {
//     return errorResponse(res, err.message, 500);
//   }
// }

// export const getHomepage = (req, res) => handleGetSingleton(Homepage, res);
// export const updateHomepage = (req, res) => handleUpdateSingleton(Homepage, req, res, 'Homepage updated');

// export const getAbout = (req, res) => handleGetSingleton(AboutPage, res);
// export const updateAbout = (req, res) => handleUpdateSingleton(AboutPage, req, res, 'About page updated');

// export const getNavigation = (req, res) => handleGetSingleton(Navigation, res);
// export const updateNavigation = (req, res) => handleUpdateSingleton(Navigation, req, res, 'Navigation updated');

// export const getSettings = (req, res) => handleGetSingleton(WebsiteSettings, res);
// export const updateSettings = (req, res) => handleUpdateSingleton(WebsiteSettings, req, res, 'Settings updated');

// export const getSEO = (req, res) => handleGetSingleton(SEOSettings, res);
// export const updateSEO = (req, res) => handleUpdateSingleton(SEOSettings, req, res, 'SEO updated');

// export const getAdvertisement = (req, res) => handleGetSingleton(Advertisement, res);
// export const updateAdvertisement = (req, res) => handleUpdateSingleton(Advertisement, req, res, 'Advertisement updated');
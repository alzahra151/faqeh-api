const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'don26jfch',
    api_key: '442292232598441',
    api_secret: 'lPqOJ3z4s-znnS49qTKNQ6CpaxU'
});

module.exports = cloudinary;
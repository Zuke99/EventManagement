const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
    cloud_name: 'djzpvaaa4', 
    api_key: '225338929289588', 
    api_secret: '0_mShfwCUo8bokUEijHyMOvaxJc' 
  });

  const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
  };

  const uploadImage = (image) => {
    //imgage = > base64
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(image, opts, (error, result) => {
        if (result && result.secure_url) {
          console.log(result.secure_url);
          return resolve(result.secure_url);
        }
        console.log(error.message);
        return reject({ message: error.message });
      });
    });
  };
  module.exports = (image) => {
    //imgage = > base64
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(image, opts, (error, result) => {
        if (result && result.secure_url) {
          console.log(result.secure_url);
          return resolve(result.secure_url);
        }
        console.log(error.message);
        return reject({ message: error.message });
      });
    });
  };
  
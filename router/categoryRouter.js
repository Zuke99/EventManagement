const express = require("express");
const router = new express.Router();
const Auth = require("../middleware/auth");

const Category = require("../models/categoryModel");

//ADD Category
router.post("/event/category", [Auth.verifyToken], async (req, res) => {
  try {
    const category_name = req.body.category_name; // Assuming category name is in the request body

    // Check if a category with the same name already exists
    const existingCategory = await Category.findOne({ category_name: category_name });

    if (existingCategory) {
      // If a category with the same name exists, return an error response
     
      //return res.status(400).json({ message: "Category already exists" });
        return res.send({status : false, message: "Category already exists"});
    }

    // If no existing category found, proceed to add the new category
    const newCategory = new Category({ category_name: category_name });
    const createdCategory = await newCategory.save();

    res.status(201).json(createdCategory);
  } catch (error) {
    //res.status(500).json({ message: "Internal server error" });
      return res.send({status: false, message: "Internal server error"});
  }
});

// Get All Category
router.get("/category", async (req, res) => {
  try {
    const getCategory = await Category.find({});
    res.send({status: true, data: getCategory});
  } catch (e) {
    res.send({status:false, message: e});
  }
});

//Get All Category based on category_name
router.get("/category/:category_name", async (req, res) => {
  try {
    const category_name = req.params.category_name;
    const getCategory = await Category.find({ category_name: category_name });
    
     //console.log(typeof(getCategory));
     //console.log(getCategory.length);
    
    if(getCategory.length>0){
     res.send({status: true, data: getCategory});
     }

    else{
      //console.log("hii");
     res.send({status : false, message: "Category does not exist"});
     }
  } 
  catch (e) {
    res.send({status:false, message: e});
  }
});

//DELETE category
router.delete("/category/:category_name", Auth.verifyToken, async (req, res) => {
  try {
    //console.log("inside delete");
    const category_name = req.params.category_name;
    const delCategory = await Category.findOneAndDelete({category_name: category_name});
    
    if(delCategory){
    res.send({status: true, data: delCategory});
    }
    else{
      res.send({status:false, message:"Category does not exist"});
    }
    //console.log("Success");
  } catch (e) {
    res.send({status: false, message: e});
  }
});

module.exports = router;
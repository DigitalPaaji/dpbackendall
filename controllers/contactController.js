const Contact = require("../models/contactModel");

const createContact = async (req, res) => {
  try {
    const { name, phone, classname, school } = req.body;


    if (!name || !phone || !classname || !school) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, phone, classname, school) are required",
      });
    }

    const newContact = await Contact.create({
      name,
      phone,
      classname,
      school,
    });

    return res.status(201).json({
      success: true,
      message: "Contact saved successfully",

    });
  } catch (error) {
 
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAllContect = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }); 

    return res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { 
 createContact,  
 getAllContect, 
}




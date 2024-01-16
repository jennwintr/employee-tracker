// Import the 'validator' module to perform string and number validation
const validator = require("validator");

// Create an object named 'validate' to hold validation functions
const validate = {
  // Validation function for non-empty strings
  validateString(str) {
    // Check if the string is not empty, return true
    // If the string is empty, return an error message
    return str !== "" ? true : "Please enter a valid response!";
  },

  // Validation function for numeric values (assumed to be salary)
  validateSalary(num) {
    // Use the 'isDecimal' function from 'validator' to check if the number is a decimal
    // If it is a decimal, return true, otherwise return an error message
    if (validator.isDecimal(num)) return true;
    return "Please enter a valid salary!";
  },

  // Function to check if two strings are equal
  isSame(str1, str2) {
    // Check if the two strings are equal, return true if they are
    // If they are not equal, the function implicitly returns 'undefined'
    if (str1 === str2) return true;
  },
};

// Export the 'validate' object, making its functions accessible to other modules
module.exports = validate;
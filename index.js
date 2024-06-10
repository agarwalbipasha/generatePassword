const fs = require("fs");
const path = require("path");
const csvjson = require("csvjson");

try {

    //Read from the CSV file
  var data = fs.readFileSync(path.join(__dirname, "source.csv"), {
    encoding: "utf8",
  });

  var options = {
    delimiter: ",",
    quote: '"',
  };

    //Create JS object
  let jsObj = csvjson.toObject(data, options);

    //Genarate password
  function generatePassword(jsObj) {
    for (obj of jsObj) {
      var length = 8,
        charset =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
      for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      obj.password = retVal;
    }
  }

  generatePassword(jsObj);

  const jsonFile = "jsonFile";

  const JSONToFile = (obj, jsonFile) =>
    fs.writeFileSync(`${jsonFile}.json`, JSON.stringify(obj, "utf8", 2));

  JSONToFile(jsObj, "jsonFile");

  // Read the JSON data from the file after writing it
  var jsonData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "jsonFile.json"), {
      encoding: "utf8",
    })
  );

  var options = {
    delimiter: ",",
    wrap: false,
  };

  // Convert JSON data back to CSV format
  var csvData = csvjson.toCSV(jsonData, options);

  // Split CSV data into lines
  var lines = csvData.split("\n");

  // Exclude the first line (header) from the lines array
  var filteredLines = lines.slice(1).join("\n");

  // Write the filtered CSV data to the destination file
  fs.writeFileSync("destination.csv", filteredLines);
} catch (error) {
  console.error("Error occurred:", error);
}

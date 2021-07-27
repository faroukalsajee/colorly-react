<?php
// Handle CORS errors
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: Content-Type');

// Create a db and table, return mysql connection
function createDatabaseTable()
{
  $servername = "localhost";
  $username = "root";
  $password = "root";
  $dbname = "color_shuffling";

  // Create connection
  $conn = new mysqli($servername, $username, $password);
  if ($conn->connect_error) {
    errorHandler($conn ->connect_error);
  }
  $query = "CREATE DATABASE IF NOT EXISTS {$dbname}";

  if ($conn->query($query) === TRUE) {
    // Update Connection
    try {
      $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
      if ($conn->connect_error) {
        errorHandler("Connection failed: $conn->connect_error");
      }
  
    // SQL to create table
      $query = "CREATE TABLE IF NOT EXISTS colors (
                id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                color_array VARCHAR(20000) NOT NULL)";
      
      if ($conn->query($query) === TRUE) {
        return $conn;
      } else {
        errorHandler("Error creating database {$conn->error}");
      }
    } catch(Exception $e) {
      errorHandler("Connection failed: {$conn->connect_error}");  
    }
  } else {
    errorHandler("Connection failed! Please check Sql server.");
  }
}

// Save data to db
function insertData($con, $data)
{
  try {
    // Empty table data before inserting new data.
    $query = "TRUNCATE TABLE `color_shuffling`.`colors`;";
    $con->query($query);

    // Convert array data to string data
    $serialized_data = implode(",", $data);
    // Save data
    $query = "INSERT INTO `color_shuffling`.`colors` (`color_array`) VALUES ('{$serialized_data}');";

    if ($con) {
      return $con->query($query);
    }

    errorHandler("Error inserting data: {$con->error}");
  } catch (Exception $e) {
    errorHandler($e->getMessage());
  }
}

function getData($con)
{
  try {
    // Get data
    $query = "select * from colors;";
    if ($con) {
      $result =  $con->query($query);
      // If result is not empty
      if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
          $data = $row;
        }
        // Join array element with a string
        return explode(",", $data['color_array']);
      } else {
        return false;
      }
    }

    errorHandler("Error getting data: {$con->error}");
  } catch (Exception $e) {
    errorHandler($e->getMessage());
  }
}

function errorHandler($errorMessage)
{
  echo json_encode(
    [
      "success" => false,
      "error" => $errorMessage
    ]
  );
  exit();
}

try {
  $con = createDatabaseTable();
} catch (Exception $e) {
  errorHandler($e->getMessage());
}
if (!$con)
  errorHandler('Connection failed! Please check Sql server.');

// Save action is mapped to POST action and Latest status is mapped to GET
if (isset($_SERVER["REQUEST_METHOD"]) && $_SERVER["REQUEST_METHOD"] == "GET") {
  $data = getData($con);
  echo json_encode(
    [
      "success" => true,
      "error" => '',
      "colors" => $data
    ]
  );
  exit();
} else {
  $rest_json = file_get_contents("php://input");
  $_POST = json_decode($rest_json, true);

  if ($_POST) {
    $data = $_POST['colors'];

    if (insertData($con, $data)) {
      echo json_encode(
        [
          "success" => true,
          "error" => '',
        ]
      );
      exit();
    } else {
      errorHandler("Error inserting data");
    }
  }
}

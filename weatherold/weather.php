<?php
// Database connection details
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'weather';

// Establish a database connection
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

// City and API details
$base_url = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=Ozark&appid=c20925545257cec1439f5bfcf3f30ea9";

// Array to hold past weather data
$weekdata_data = array();

// Get current time
$current_time = time();

// Make API request and decode response
$response = file_get_contents($base_url);
$data = json_decode($response, true);

// Get current date in YYYY-MM-DD format
$now = new DateTime();
$currentDate = $now->format('Y-m-d');

// Extract temperature and date
$temp = ($data['main']['temp']);
$date = $currentDate;

// Check if a record with the same date exists in the database
$checkQuery = "SELECT * FROM weather_data WHERE date = '$date'";
$results = mysqli_query($conn, $checkQuery);

// Retrieve past weather data from the database
$sevenDaysAgo = date('Y-m-d', strtotime('-7 days'));
$sql = "SELECT * FROM weather_data WHERE date >= '$sevenDaysAgo'";
$result = mysqli_query($conn, $sql);

while ($row = mysqli_fetch_assoc($result)) {
    $weekdata_data[] = array(
        'temperature' => $row['temperature'],
        'date' => $row['date']
    );
}

// If no record exists for the current date, insert the temperature into the database
$row = $results->fetch_assoc();
if (!$row) {
    $sql = "INSERT INTO weather_data (temperature, date) VALUES ('$temp', '$date')";
    mysqli_query($conn, $sql);
}

// Display past weather data
foreach ($weekdata_data as $object) {
    echo "<div class='card small'>
        <p class='wind mb-8'>Date: {$object['date']}</p>
        <p class='wind'>Temperature: {$object['temperature']}°C</p>
      </div>";
}
?>

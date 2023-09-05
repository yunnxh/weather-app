<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $post_data = file_get_contents("php://input");
    $data = json_decode($post_data);

    if ($data && isset($data->city) && isset($data->weatherData)) {
        $city = $data->city;
        $temperature = $data->weatherData->temperature;
        $date = date('Y-m-d');

        // Establish a database connection (replace with your database credentials)
        $conn = new mysqli('localhost', 'root', '', 'weather');

        // Insert the weather data into the database
        $sql = "INSERT INTO weather_data (temperature, date) VALUES ($temperature, '$date')";
        $result = mysqli_query($conn, $sql);

        if ($result) {
            $response = ['success' => true, 'message' => 'Weather data cached successfully'];
        } else {
            $response = ['success' => false, 'message' => 'Error caching weather data'];
        }

        // Close the database connection
        mysqli_close($conn);

        echo json_encode($response);
    }
}
?>

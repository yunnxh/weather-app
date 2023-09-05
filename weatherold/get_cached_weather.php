<?php
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['city'])) {
        $city = $_GET['city'];

        // Establish a database connection (replace with your database credentials)
        $conn = new mysqli('localhost', 'root', '', 'weather');

        // Calculate the date one week ago from today
        $oneWeekAgo = date('Y-m-d', strtotime('-1 week'));

        // Modify the SQL query to select data for the past week
        $sql = "SELECT * FROM weather_data WHERE city = '$city' AND date >= '$oneWeekAgo'";

        $result = mysqli_query($conn, $sql);

        if ($result && mysqli_num_rows($result) > 0) {
            // Store historical weather data in an array
            $weatherData = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $weatherData[] = [
                    'temperature' => $row['temperature'],
                    'date' => $row['date'],
                ];
            }
            $response = ['weatherData' => $weatherData];
        } else {
            $response = ['weatherData' => null];
        }

        // Close the database connection
        mysqli_close($conn);

        echo json_encode($response);
    }
}
?>

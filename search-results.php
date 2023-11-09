<?php
include 'functions.php';
$conn = connect();

$searchType = isset($_GET['searchType']) ? $_GET['searchType'] : null;


$query = "SELECT songs.*, artists.artist_name, genres.genre_name 
          FROM songs 
          JOIN artists ON songs.artist_id = artists.artist_id 
          JOIN genres ON songs.genre_id = genres.genre_id ";


switch ($searchType) {
case 'title':
    $title = $_GET['title'];
    $query .= "WHERE songs.title LIKE :title";
    break;
case 'artist':
    $artist_id = $_GET['artist_id'];
    $query .= "AND artists.artist_id = :artist_id";  
    break;
case 'genre':
    $genre_id = $_GET['genre_id'];
    $query .= "AND genres.genre_id = :genre_id";  
    break;
    case 'yearEquals':
        $yearValue = $_GET['yearValue'];
        $query .= "WHERE year = :yearValue";
        break;
    case 'yearGreaterThan':
        $yearGreaterThan = $_GET['yearGreaterThan'];
        $query .= "WHERE year > :yearGreaterThan";
        break;
    case 'yearLessThan':
        $yearLessThan = $_GET['yearLessThan'];
        $query .= "WHERE year < :yearLessThan";
        break;
default:
   
}


$stmt = $conn->prepare($query);


switch ($searchType) {
case 'title':
    $titleSearch = '%' . $title . '%';
    $stmt->bindParam(":title", $titleSearch);
    
    break;
case 'artist':
    $stmt->bindParam(":artist_id", $artist_id, PDO::PARAM_INT);
    break;
case 'genre':
    $stmt->bindParam(":genre_id", $genre_id, PDO::PARAM_INT);
    break;
    case 'yearEquals':
        $stmt->bindParam(":yearValue", $yearValue, PDO::PARAM_INT);
        break;
    case 'yearGreaterThan':
        $stmt->bindParam(":yearGreaterThan", $yearGreaterThan, PDO::PARAM_INT);
        break;
    case 'yearLessThan':
        $stmt->bindParam(":yearLessThan", $yearLessThan, PDO::PARAM_INT);
        break;
}

$stmt->execute();
$songs = $stmt->fetchAll(PDO::FETCH_ASSOC);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="css/Search-Results.css">
    <link rel="stylesheet" href="css/footer.css">
    <title>Search Results</title>
</head>
<body>

<?php include('header.php') ?>

    <div class="content">
        <table class="browse">
            <tr>
                <th>Title</th>
                <th>Artist</th>
                <th>Year</th>
                <th>Genre</th>
                
            </tr>
            <?php
        if (!empty($songs)) {
            foreach ($songs as $song) {
                ?>
                <tr>
                    <td><?=$song['title']?></td>
                    <td><?=$song['artist_name']?></td>
                    <td class="table_year"><?=$song['year']?></td>
                    <td><?=$song['genre_name']?></td>
                    
                    <td><a href="favorites.php?action=add&songID=<?= $song['song_id'] ?>">Add to Favorites</a></td>
                    <td><a class="Button" href="single-page.php?songID=<?=$song["song_id"]?>">View</a></td>

                </tr>  
                <?php
            }
        } else {
            echo "<tr><td colspan='7'>No songs found.</td></tr>";
        }
        ?>
          
          
        </table>    
    </div> 
  


    <footer>
    <h4>Copyright Noah & Dallas - COMP 3512 - Assignment 1</h4>
<a href="https://github.com/Noah1018/3512-A1"> Our Repository</a>
<a href="https://github.com/Noah1018">Noah's github</a>
<a href="https://github.com/dmax98">Dallas' github</a>
    </footer>
</body>
</html>

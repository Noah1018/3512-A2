<?php
include 'functions.php';


if(isset($_GET['songID'])) {
    $song_id = $_GET['songID'];
    $song = getSongDetails($song_id);
} else {

    die("No song selected.");
}


?>
<!DOCTYPE html>
<html>
<head>
<title>Single Song Page</title>
    <link rel="stylesheet" href="css/SingleSongPage.css">
    <link rel="stylesheet" href="css/footer.css">

</head>
<body>
<?php include('header.php') ?>

    <main>
        <h2>Song Information</h2>
        <li>  <p><strong>Title:</strong> <?php echo $song['title']; ?></p></li>
        <li><p><strong>Artist:</strong> <?php echo $song['artist_name']; ?></p></li>
        <li><p><strong>Genre:</strong> <?php echo $song['genre_name']; ?></p></li>
        <li> <p><strong>Year:</strong> <?php echo $song['year']; ?></p></li>
        <li><p><strong>BPM:</strong> <?php echo $song['bpm']; ?></p></li>
        <li><p><strong>energy:</strong> <?php echo $song['energy']; ?></p></li>
        <li> <p><strong>danceability:</strong> <?php echo $song['danceability']; ?></p></li>
        <li><p><strong>loudness:</strong> <?php echo $song['loudness']; ?></p></li>
        <li> <p><strong>liveness:</strong> <?php echo $song['liveness']; ?></p></li>
        <li><p><strong>valence:</strong> <?php echo $song['valence']; ?></p></li>
        <li>  <p><strong>duration:</strong> <?php echo $song['duration']; ?></p></li>
        <li> <p><strong>acousticness:</strong> <?php echo $song['acousticness']; ?></p></li>
        <li> <p><strong>speechiness:</strong> <?php echo $song['speechiness']; ?></p></li>
        <li> <p><strong>popularity:</strong> <?php echo $song['popularity']; ?></p></li>
      

    </main>

    <footer>
    <h4>Copyright Noah & Dallas - COMP 3512 - Assignment 1</h4>
<a href="https://github.com/Noah1018/3512-A1"> Our Repository</a>
<a href="https://github.com/Noah1018">Noah's github</a>
<a href="https://github.com/dmax98">Dallas' github</a>
    </footer>
</body>
</html>


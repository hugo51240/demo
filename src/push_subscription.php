<?php
$subscription = json_decode(file_get_contents('php://input'), true);

if (!isset($subscription['endpoint'])) {
    echo 'Error: not a subscription';
    return;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'POST':
        // create a new subscription entry in your database (endpoint is unique)
        $bd = mysqli_connect('127.0.0.1:8080', 'root', '', 'push-notifications');

        $requete = $bd->prepare(" INSERT INTO push-notif(endpoint) VALUES ( ? ) ");
        $requete->execute(array($_POST['endpoint']));
        break;

    case 'PUT':
        // update the key and token of subscription corresponding to the endpoint
        $bd = new PDO("mysql:host=127.0.0.1:8080;dbname=push-notifications;charset=utf-8", "root", "");

        $requete = mysqli_connect('127.0.0.1:8080', 'root', '', 'push-notifications');
        $requete->execute(array($_POST['p256dh'], $_POST['auth'], $_POST['endpoint']));
        break;

    case 'DELETE':
        // delete the subscription corresponding to the endpoint
        $bd = mysqli_connect('127.0.0.1:8080', 'root', '', 'push-notifications');

        $requete = $bd->prepare(" DELETE INTO push-notif(endpoint) Where endpoint= ? ");
        $requete->execute(array($_POST['endpoint'], $_POST['p256dh'], $_POST['auth']));
        break;

    default:
        echo "Error: method not handled";
        return;
}


/****** TEST CONNECTION ******/

$conn = mysqli_connect('127.0.0.1:8080', 'root', '', 'push-notifications');

/*** SELECT ***/
// On créé la requête
$req = "SELECT * FROM push-notif";

// on envoie la requête
$res = $conn->query($req);

// on va scanner tous les tuples un par un
echo "<table>";
while ($data = mysqli_fetch_array($res)) {
    // on affiche les résultats
    echo "<tr><td>" . $data['endpoint'] . "</td><td>" . $data['p256dh'] . "</td><td>" . $data['auth'] . "</td></tr>";
}
echo "</table>";


/*** INSERT ***/
// On créé la requête
$req = "INSERT INTO push-notif( ? ) VALUES ('Du texte mysqli')";

// on envoie la requête
$res = $conn->query($req);


/*** DELETE ***/
// On créé la requête
$req = "DELETE FROM push-notif WHERE endpoint='Du texte mysqli'";

// on envoie la requête
$res = $conn->query($req);


/*** FERMER LA SESSION ***/

// on ferme la connexion
mysqli_close($conn);


/*** PROTECTION SQL ***/
// Se protéger des injections SQL
$endpoint = $conn->real_escape_string($_GET['endpoint']);
$conn->query("SELECT * FROM push-notif WHERE endpoint = '$endpoint'");



/*** REQUETE PREPARE ***/
// mysqli, Requête préparée
$query = $conn->prepare('SELECT * FROM push-notif WHERE endpoint = ?');
$query->bind_param('s', $endpoint); // s = string, i = integer
$query->execute();


/*** TEST LIGNES ***/
// on crée la requête SQL
$req = "SELECT * FROM push-notif WHERE chk_actif=1;";

// on envoie la requête
$res = $conn->query($req) or die();

// Si on a des lignes...
if ($res->num_rows > 0) {
    echo "On a des résultats";
} else {
    echo "On n'a aucun résultat";
}

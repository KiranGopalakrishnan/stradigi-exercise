<?php
// Get Env variable to automatically include environment config
defined('APPLICATION_ENV')
    || define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ?
                                  getenv('APPLICATION_ENV') :
                                  'local'));

// show errors when working on local
if(APPLICATION_ENV === 'local'){
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
}

require '../vendor/autoload.php';
require '../configs/'.strtolower(APPLICATION_ENV).'.config.php';

// Setup custom Twig view
$twigView = new \Slim\Views\Twig();

$app = new \Slim\Slim(array(
    'debug' => true,
    'view' => $twigView,
    'templates.path' => '../templates/',
));

// Automatically load controller files
$controllers = glob('../controllers/*.php');
foreach ($controllers as $controller) {
    require $controller;
}

$app->run();

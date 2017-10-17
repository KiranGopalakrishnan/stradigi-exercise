<?php

// GET index route
$app->get('/', function () use ($app) {
    $images = new models\Images();
    $imagesData = $images->getImages();
    $parsedData = json_decode($imagesData,true); //returns an array
    $app->render('index.html', array('images' => $parsedData));
});
// GET panels route
$app->get('/panels', function () use ($app) {
    $panels = new models\Panels();
    $panelsData = $panels->getPanelData();
    $parsedData = json_decode($panelsData,true); //returns an array
    $app->render('panel.html', array('panels' => $parsedData));
});

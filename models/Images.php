<?php

namespace models;
use GuzzleHttp\Client;

class Images {

	private $API_KEY="EaCnmIG6flyizJVvfsCPUP7525WowfZu";
	protected $LIMIT = 12;
	private $BASE_URL= "https://api.giphy.com/v1/gifs/search?q=movies";
	public function getImages($offset=0)
	{
		$url = $this->BASE_URL."&offset=".$offset."&limit=".$this->LIMIT."&api_key=".$this->API_KEY;
		$client = new Client();
		$res = $client->get($url);
		return $res->getBody();             // Outputs the JSON decoded data

	}
}

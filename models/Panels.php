<?php

namespace models;
/* Manages data related to the panels */
class Panels {

	private $BASE_URL= "../JSON/panelPageContent.json";
	public function getPanelData()
	{
		$string ='';
		try{
		$string = file_get_contents($this->BASE_URL);
	}catch(Exception $e){
		echo "An exception occured while reading data";
	}
		return $string;             // Outputs the JSON decoded data
	}
}

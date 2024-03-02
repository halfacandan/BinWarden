<?php

	require_once("enums/httpStatus.enum.php");

	function ParsePostedJson(){
		
		$postBody = file_get_contents('php://input');
		
		if($postBody == null){
			return null;
		}

		return json_decode($postBody);
	}
	
	function VerifyRequestIs($requiredRequestVerb){
		$requestVerb = $_SERVER['REQUEST_METHOD'];
		
		if($requestVerb !== $requiredRequestVerb) {
			header(HttpStatus::NOTFOUND->value);
			exit;
		}
	}	
?>
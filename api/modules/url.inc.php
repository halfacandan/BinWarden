<?php

	require_once("classes/apiEndpoint.class.php");
	
	#region Public functions
	
	function GetApiPath(){

		$protocol= isset($_SERVER['HTTPS']) && !empty($_SERVER['HTTPS']) ? 'https' : 'http';
		$basePath = "/api/";
		$baseUrl = $protocol."://".$_SERVER['HTTP_HOST'].$basePath;
		$path = rtrim(str_replace($basePath, "",strtok($_SERVER['REQUEST_URI'], "?")), "/");

		$genericPath = $path;
		$controller = null;
		$method = null;

		$urlParser =  '/v(?<ApiVersion>[0-9])';
		$urlParser .= '\/(?<Controller>email|news|stats)';
		$urlParser .= '(?:\/(?<Method>graph|latest|send))?';
		$urlParser .= '(?:\/(?<FilterValue>[^\/]+))?';
		$urlParser .= '(?:\/(?<FilterValueAlt>[^\/]+))?';
		$urlParser .= '(?:\/(?<FilterValueFinal>[^\/]+))?';
		$urlParser .= '/i';

		if(preg_match($urlParser, $path, $matches) == 1){
			
			$controller = $matches['Controller'];
			$method = $matches['Method'];

			$parameters = ValidateUrlParameters();
		}	

		return new ApiEndpoint(
			$baseUrl,
			$basePath,
			$path,
			$genericPath,
			$matches['ApiVersion'] ?? 1,
			$controller,
			$method,
			$matches['FilterValueAlt'],
			$matches['FilterValueFinal'],
			$parameters
		);
	}

	function ValidateUrlParameters(){

		$validParameterNames = array('export');

		$validatedParameters = array();
		foreach($validParameterNames as $validParameterName){
		
			$actualParameterValue = urldecode(strval($_GET[$validParameterName]));

			if(!IsNullOrEmptyString($actualParameterValue)){
				
				switch($validParameterName){
					case "export":

						$validatedParameters[$validParameterName] = true;

						break;
				}
			}
		}

		return $validatedParameters;
	}

	#endregion
?>
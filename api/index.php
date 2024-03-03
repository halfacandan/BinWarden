<?php

	ini_set('display_errors', 1);
	
    // Handle Pre-flight CORS OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {    
        
        header("Access-Control-Allow-Origin: *");
        header("Content-Type: */*; charset=UTF-8");
        header("Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, jwt-auth"); 
        return;
    }

    // Load enums
    require_once("enums/httpStatus.enum.php");

    // Create Database credentials
    require_once("../db/databases.inc.php");
    $databases = LoadDatabases("../db/binwarden.databases.json");
    if($databases == null){
        header(HttpStatus::INTERNALSERVERERROR->value);
		exit;
    }

	// Load base modules (order is important)
	require_once("modules/global.inc.php");
	require_once("modules/url.inc.php");
	require_once("modules/requests.inc.php");

	// Endpoint Redirection
	try{

		$apiEndpoint = GetApiPath();

	} catch(\Throwable) {

		header(HttpStatus::FORBIDDEN->value);
		exit;
	}

    header("Access-Control-Allow-Origin: ".$apiEndpoint->BaseUrl);

	switch($apiEndpoint->Controller){
		case "email": {

            VerifyRequestIs("POST");

            $data = ParsePostedJson();
	
            if($apiEndpoint->Method != "send" || $data == null || (IsNullOrEmptyString($data->blackBin) && IsNullOrEmptyString($data->greenBin))) {

                header(HttpStatus::BADREQUEST->value);
                exit;
            }

            require_once("modules/email.inc.php");

            $emailSent = SendEmail(
                $databases->website,
                $data->blackBin ?? false,
                $data->greenBin ?? true,
                $data->email
            );

            if($emailSent) {

                $dto = array(
                    'successMessage' => "Email sent"
                );

            } else {

                $dto = array(
                    'errorMessage' => "Email failed to send"
                );
            }

			break;
		}
		case "news": {

            VerifyRequestIs("GET");

            require_once("modules/news.inc.php");

            $newsItems = GetNewsItems($databases->website);

            $dto = array(
                'messages' => "List the news items for the site",
                'count' => count($newsItems),
                'newsItems' => $newsItems
            );

            break;
        }
		case "stats": {

            VerifyRequestIs("GET");

            require_once("modules/stats.inc.php");

            switch($apiEndpoint->Method){
                case "latest": {
            
                    $latestReports = GetLatestReports($databases->website);

                    $dto = array(
                        "blackBin" => array(
                            "latest" => $latestReports["blackBin"],
                            "nextAnon" => addBusinessDays($latestReports["blackBin"], 2)
                        ),
                        "greenBin" => array(
                            "latest" => $latestReports["greenBin"],
                            "nextAnon" => addBusinessDays($latestReports["greenBin"], 2)
                        )
                    );

                    break;
                }
                case "graph": {
            
                    $reports = GetTrendedReportData($databases->website);

                    if($apiEndpoint->Parameters['export'] == true){

                        // CSV export
                        header(HttpStatus::OK->value);
                        header("Content-Type: text/csv");
                        header("Content-Disposition: attachment; filename=bin_warden_reports.csv");

                        ArrayToCSV($reports, false);
                        exit;

                    }

                    $dto = array(
                        'messages' => "List the number of reports per month",
                        'count' => count($reports),
                        'reports' => $reports
                    );

                    break;
                }
                default: {

                    header(HttpStatus::FORBIDDEN->value);
                    exit;
                }
            }

            break;
        }
		default: {

			header(HttpStatus::FORBIDDEN->value);
			exit;
		}
	}

	header(HttpStatus::OK->value);
	header('Content-Type: application/json');
	print(json_encode($dto));
?>
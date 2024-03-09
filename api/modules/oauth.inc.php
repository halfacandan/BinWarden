<?php

    // https://tutorialspage.com/simple-oauth2-example-using-php-curl/

    // There are two types of oAuth used by the Gmail API:
    // 1) Client Token - This is used to grant a machine long-term access to the Gmail API and requires an Organization to be set up
    // 2) User Token - This is a short/medium-term grant to a specific user's data and is used by this code

    // User Token oAuth is a 2 step process:
    // 1) Get a temporary "code" via the authorisation endpoint
    // 2) Use the temporary code to create a token via the token endpoint

    // Set up an "OAuth 2.0 Client ID" at https://console.cloud.google.com/apis/credentials
    // Add "https://developers.google.com/oauthplayground" to "Authorized redirect URIs"
    // Go to https://developers.google.com/oauthplayground
    // Click the cog to add your application's secret and client id
    // Select the "Offline" Access Type to prevent an authorisation prompt on token refresh
    // Follow the steps, adding "compose" and "readonly" scopes from the Gmail API

    define("REFRESH_TOKEN_URL", "https://oauth2.googleapis.com/token");
    define("REFRESH_TOKEN", "[REDACTED]");
    define("CLIENT_ID", "[REDACTED]");
    define("CLIENT_SECRET", "[REDACTED]");
    define("SCOPES", ["https://www.googleapis.com/auth/gmail.readonly", "https://www.googleapis.com/auth/gmail.compose"]);

    #region User Tokens

    function GetRefreshedUserToken(?string $refreshToken = null): ?string {
    // https://developers.google.com/identity/protocols/oauth2/web-server#offline

        $refreshToken = $refreshToken ?? REFRESH_TOKEN;
        if(IsNullOrEmptyString($refreshToken)) return null;

        $postData = array(  
            'client_id' => CLIENT_ID,
            'client_secret' => CLIENT_SECRET,
            'grant_type' => 'refresh_token',
            'refresh_token' => $refreshToken
        );

        $curl = curl_init();
        
        $params = array(
            CURLOPT_URL => REFRESH_TOKEN_URL,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => http_build_query($postData),
            CURLOPT_NOBODY => false, 
            CURLOPT_HTTPHEADER => array(
                "cache-control: no-cache",
                "content-type: application/x-www-form-urlencoded",
                "accept: *",
                "accept-encoding: gzip, deflate",
            ),
            CURLOPT_ENCODING => 'gzip'
        );
        
        curl_setopt_array($curl, $params);
        
        $response = curl_exec($curl);
        $err = curl_error($curl);
        
        curl_close($curl);

        if ($err) {

            return null;

        } else {

            $response = json_decode($response, true);

            if(array_key_exists("access_token", $response)) {

                return $response["access_token"];
            }
        
            if(array_key_exists("error", $response)) {
                
                return null;

            }
        }

        return null;
    }

    #endregion
?>
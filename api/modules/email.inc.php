<?php
    
    #region Public functions

    function GetGmailBody(?Database $database = null, bool $blackBin, bool $greenBin, ?string $email = null): ?array {

        if($database == null) return null;

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $email = null;

        $gmailBody = array(
            "MIME-Version: 1.0",
            "Content-Type: text/html; charset=UTF-8",
            "To: <customer.care@edinburgh.gov.uk>, <waste@edinburgh.gov.uk>",
            "From: Bin Warden<binwardenuk@gmail.com>",
            "Subject: Missed Bin Collection (Cannot be reported online)"
        );
        if($email != null){
            array_push($gmailBody, "Reply-To: <".strtolower($email).">");
            array_push($gmailBody, "CC: <".strtolower($email).">");
        }
        array_push($gmailBody, ""); // Needs a linebreak between the headers and the body in order to display the email body
        array_push($gmailBody, GetEmailTemplate($database, $blackBin, $greenBin));

        return $gmailBody;
    }

    function SendGmail(?Database $database = null, ?string $userAccessToken, bool $blackBin, bool $greenBin, ?string $email = null): bool {
        
        if($database == null || IsNullOrEmptyString($userAccessToken)) return false;

        $curlHandler = curl_init();
        curl_setopt($curlHandler, CURLOPT_URL, "https://www.googleapis.com/upload/gmail/v1/users/me/messages/send");
        curl_setopt($curlHandler, CURLOPT_HTTPHEADER,
            array(
                'Accept: application/json',
                'Authorization: Bearer '.$userAccessToken,
                'Content-Type: message/rfc822'
            )
        );
        curl_setopt($curlHandler, CURLOPT_RETURNTRANSFER, TRUE);

        
        curl_setopt($curlHandler, CURLOPT_NOBODY, false);
        
        $gmailBody = GetGmailBody($database, $blackBin, $greenBin, $email) ?? [];
        curl_setopt($curlHandler, CURLOPT_POSTFIELDS, implode("\r\n", $gmailBody));

        $result = curl_exec($curlHandler);
        if(curl_getinfo($curlHandler, CURLINFO_HTTP_CODE) == 200){

            curl_close($curlHandler);

            $userInfo = json_decode($result);

            try {
                
                $mailSent = $userInfo->labelIds[0] == "SENT";

                if($mailSent) LogEmailSent($database, $blackBin, $greenBin);

                return $mailSent;

            } catch(\Throwable){

                return false;
            }
        }

        curl_close($curlHandler);
        //if(curl_errno($curlHandler)) {}
        return false;           
    }

    function GetEmailTemplate(?Database $database = null, ?bool $blackBin = false, ?bool $greenBin = false, ?int $templateId = 1, ?int $siteId = 1): ?string{

        if($database == null) return null;

        $SQL = "SELECT `template`
                FROM email_templates
                WHERE id = :templateId;
                
                SELECT `address`, CASE WHEN `additionalInfo` IS NULL THEN NULL ELSE CONCAT('<p>',`additionalInfo`,'</p>') END as additionalInfo
                FROM sites
                WHERE id = :siteId;";

        $SQLStatement = $database->PrepareSQL($SQL);
        $SQLStatement->bindValue(":templateId", ($templateId ?? 1), PDO::PARAM_INT);
        $SQLStatement->bindValue(":siteId", ($siteId ?? 1), PDO::PARAM_INT);
        $SQLStatement->execute();
        $database->CloseConnection();

        if(!$SQLStatement) return null;

        $emailBody = $SQLStatement->fetchAll(PDO::FETCH_COLUMN, 0)[0];
        $SQLStatement->nextRowset(); // Shift to Second recordset
        $siteDetails = $SQLStatement->fetchAll(PDO::FETCH_ASSOC)[0];

        $binList = "";
        if($blackBin) $binList .= "<li>General Waste (Black Bins)</li>";
        if($greenBin) $binList .= "<li>Recycling (Green Bins)</li>";

        $emailBody = str_replace("{BINS}", $binList, $emailBody);
        $emailBody = str_replace("{ADDRESS}", $siteDetails["address"], $emailBody);
        $emailBody = str_replace("{ADDITIONAL_INFO}", $siteDetails["additionalInfo"], $emailBody);

        return $emailBody;
    }

    function LogEmailSent(?Database $database = null, bool $blackBin, bool $greenBin, ?int $templateId = 1, ?int $siteId = 1): void {

        if($database == null) return;

        $SQL = "INSERT INTO emails (templateId, siteId, blackBin, greenBin, sentDateUTC) VALUES
                (:templateId, :siteId, :blackBin, :greenBin, UTC_TIMESTAMP());";

        $SQLStatement = $database->PrepareSQL($SQL);
        $SQLStatement->bindValue(":templateId", ($templateId ?? 1), PDO::PARAM_INT);
        $SQLStatement->bindValue(":siteId", ($siteId ?? 1), PDO::PARAM_INT);
        $blackBinValue = $blackBin ? 1 : 0;
        $SQLStatement->bindValue(":blackBin", $blackBinValue, PDO::PARAM_INT);
        $greenBinValue = $greenBin ? 1 : 0;
        $SQLStatement->bindValue(":greenBin", $greenBinValue, PDO::PARAM_INT);
        $SQLStatement->execute();
        $database->CloseConnection();

        return;
    }

    #endregion
?>
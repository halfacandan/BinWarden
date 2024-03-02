<?php
    
    #region Public functions
	
	function SendEmail(?Database $database = null, bool $blackBin, bool $greenBin, ?string $email = null): bool {

		if($database == null) return false;

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $email = null;

        $to = "waste@edinburgh.gov.uk, customer.care@edinburgh.gov.uk";
        $subject = "Missed Bin Collection (Cannot be reported online)";
        $message = GetEmailTemplate($database, $blackBin, $greenBin);
        $headers = array(
            "MIME-Version: 1.0",
            "Content-Type: text/html; charset=UTF-8",
            'From: Bin Warden<binwarden@s171553821.websitehome.co.uk>'            
        );
        if($email != null){
            array_push($headers, 'Reply-To: '.strtolower($email));
            array_push($headers, 'CC: '.strtolower($email));
        }

        $mailSent = mail(
            $to,
            $subject,
            $message,
            implode("\r\n", $headers)
        );

        if($mailSent) LogEmailSent($database, $blackBin, $greenBin);

        return $mailSent;
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
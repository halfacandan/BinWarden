<?php
    
    #region Public functions
	
	function GetLatestReports(?Database $database = null): ?array {

		if($database == null) return null;

		$SQL = "SELECT `type`, sentDateUTC FROM (
                    SELECT 'blackBin' as `type`, sentDateUTC
                    FROM emails
                    WHERE blackBin = 1
                    ORDER BY sentDateUTC DESC
                    LIMIT 1
                ) a
                UNION ALL SELECT `type`, sentDateUTC FROM (
                    SELECT 'greenBin' as type, sentDateUTC
                    FROM emails
                    WHERE greenBin = 1
                    ORDER BY sentDateUTC DESC
                    LIMIT 1
                ) b;";

        $SQLStatement = $database->PrepareSQL($SQL);
        $SQLStatement->execute();
        $database->CloseConnection();

		if(!$SQLStatement) return null;

        $latestReports = array(
            "blackBin" => null,
            "greenBin" => null
        );
        $SQLStatement->fetchAll(PDO::FETCH_FUNC, function($type, $sentDateUTC) USE(&$latestReports){
            $latestReports[$type] = $sentDateUTC;
        });

        return $latestReports;
	}

    function GetTrendedReportData(?Database $database = null): ?array {

		if($database == null) return null;

		$SQL = "SELECT DATE_FORMAT(sentDateUTC, '%b ''%y') as yearMonth, SUM(blackBin) as blackBin, SUM(greenBin) as greenBin
                FROM `emails`
                GROUP BY DATE_FORMAT(sentDateUTC, '%b ''%y')
                ORDER BY MAX(DATE_FORMAT(sentDateUTC, '%Y%j')) DESC;";

        $SQLStatement = $database->PrepareSQL($SQL);
        $SQLStatement->execute();
        $database->CloseConnection();

		if(!$SQLStatement) return null;

        return $SQLStatement->fetchAll(PDO::FETCH_ASSOC) ?? [];
	}

    #endregion
?>
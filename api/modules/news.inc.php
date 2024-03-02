<?php
    
    #region Public functions
	
	function GetNewsItems(?Database $database = null): ?array {

		if($database == null) return null;

		$SQL = "SELECT `message`
				FROM news
				WHERE displayFromUTC <= UTC_TIMESTAMP()
                    AND displayUntilUTC > UTC_TIMESTAMP()
                ORDER BY displayFromUTC ASC
                LIMIT 1;";

        $SQLStatement = $database->PrepareSQL($SQL);
        $SQLStatement->execute();
        $database->CloseConnection();

		if(!$SQLStatement) return null;

        $newsItems = $SQLStatement->fetchAll(PDO::FETCH_FUNC, 
            fn($message) => (object)array("message" => $message)
        );
        
        return $newsItems;
	}

    #endregion
?>
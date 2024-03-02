<?php

    require_once("database.class.php");

    // ENCRYPTION_KEY must be 32 characters
    define("DATABASE_CREDENTIAL_ENCRYPTION_KEY", "[REDACTED]");

    function LoadDatabases(string $databaseConfigFilePath = null): ?StdClass {

        if($databaseConfigFilePath === null || trim($databaseConfigFilePath) === '') {

            return null;
        }

        if(!file_exists($databaseConfigFilePath)){

            return null;
        }

        $databasesDetails = json_decode(file_get_contents($databaseConfigFilePath));
        
        $databases = [];
        foreach ($databasesDetails as $name => $databasesDetail) {

            $databases[$name] = new Database($databasesDetail, DATABASE_CREDENTIAL_ENCRYPTION_KEY);
        }

        return (object)$databases;
    }
?>
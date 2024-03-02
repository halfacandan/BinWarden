<?php

    class Database {

        private string $Host;
        private string $Database;
        private string $User;
        private string $PasswordEncrypted;
        private string $EncryptionKey;

        private ?PDO $Connection;

        private function ConnectionString(){

            return "mysql:host=$this->Host;dbname=$this->Database;charset=utf8";
        }

        private function SafeDecrypt(string $encrypted, string $key): string {

            if($encrypted === null || trim($encrypted) === '' || $key === null || trim($key) === '') {

                return null;
            }

            $decoded = base64_decode($encrypted);
            $nonce = mb_substr($decoded, 0, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES, '8bit');
            $ciphertext = mb_substr($decoded, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES, null, '8bit');
            
            $plain = sodium_crypto_secretbox_open(
                $ciphertext,
                $nonce,
                $key
            );
            if (!is_string($plain)) {
                throw new Exception('Invalid MAC');
            }
            sodium_memzero($ciphertext);
            sodium_memzero($key);

            return $plain;
        }

        private function Password(){

            return $this->SafeDecrypt($this->PasswordEncrypted, $this->EncryptionKey);
        }

        function __construct(object $databasesDetails, string $encryptionKey) {

            $this->Host = $databasesDetails->host;
            $this->Database = $databasesDetails->database;
            $this->User = $databasesDetails->user;
            $this->PasswordEncrypted = $databasesDetails->password;

            $this->EncryptionKey = $encryptionKey;
        }

        public function PrepareSQL(string $sql = null): ?PDOStatement {

            if($sql === null || trim($sql) === '') {

                return null;
            }

            // Connect to the database
            try {

                $this->Connection = new PDO($this->ConnectionString(), $this->User, $this->Password());

                // Set error-handling mode
                $this->Connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                $statement = $this->Connection->prepare($sql);

                return $statement;
            }
            catch(PDOException $e) {

                return null;
            }
        }

        public function CloseConnection(){

            $this->Connection = null;
        }
    }
?>
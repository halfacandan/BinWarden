<?php

    enum HttpStatus : string {

        use EnumToArray;

        case OK = "HTTP/1.1 200 OK";
        case BADREQUEST = "HTTP/1.1 400 Bad Request";
        case UNAUTHORIZED = "HTTP/1.1 401 Unauthorized";
        case FORBIDDEN = "HTTP/1.1 403 Forbidden";
        case NOTFOUND = "HTTP/1.1 404 Not Found";
        case TOOMANYREQUESTS = "HTTP/1.1 429 Too Many Requests";
        case INTERNALSERVERERROR = "HTTP/1.1 500 Internal Server Error";
    }

    // https://stackoverflow.com/questions/69793557/how-to-get-all-values-of-an-enum-in-php
    trait EnumToArray {
    
        public static function names(): array {
            return array_column(self::cases(), 'name');
        }
        
        public static function values(): array {
            return array_column(self::cases(), 'value');
        }
        
        public static function array(): array {
            return array_combine(self::names(), self::values());
        }    
    }

    function HttpStatusFromStatusCode(int $statusCode): ?HttpStatus {

		try {

            $HttpStatusArray = HttpStatus::array();

            $matchedStatus = array_filter($HttpStatusArray, function($value) use($statusCode) {
                return strpos($value, strval($statusCode)) !== false;
            });

            if(count($matchedStatus) < 1) {

                return null;

            } else {

                return constant("HttpStatus::".array_keys($matchedStatus)[0]);
            }

		} catch (Throwable) {

			return null;
		}		
	}
?>
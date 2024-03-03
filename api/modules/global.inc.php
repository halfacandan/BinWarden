<?php

	#region Strings

	function IsNullOrEmptyString(?string $string): bool {
		return $string === null || trim($string) === '';
	}

	#endregion

	#region CSV

	function ArrayToCSV(array $array, bool $callSerialiser = true){

		$output = fopen("php://output", "wb");

		$exportHeader = true;
		foreach ($array as $row) {
			$rowData = $callSerialiser ? (array)$row->csvSerialize() : (array)$row;
			if($exportHeader){
				fputcsv($output, array_keys($rowData));
				$exportHeader = false;
			}
			fputcsv($output, $rowData);
		}
		fclose($output);
	}

	#endregion

    #region DataTime

    function AddBusinessDays(string $startDate, int $businessDays): string {
        
        $endDate = strtotime($startDate);
        
        do {
            $endDate = strtotime('+1 day', $endDate);
            if(IsWorkDay($endDate)) $businessDays--;
        } while ($businessDays > 0);

        return date("Y-m-d H:i:s", $endDate);
    }

    function IsWorkDay(int $UnixTimestamp): bool {

        // 1 for Monday, 7 for Sunday
        return date('N', $UnixTimestamp) < 6;
    }

    #endregion
?>
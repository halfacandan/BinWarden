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
?>
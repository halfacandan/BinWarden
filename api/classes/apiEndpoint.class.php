<?php

    class ApiEndpoint implements JsonSerializable {

        public string $BaseUrl;
        public string $BasePath;
        public string $Path;
        public string $FullPath;
        public string $GenericPath;
        public int $Version;
        public string $Controller;
        public ?string $Method;
        public ?string $Filter;
        public ?string $Filter2;
        public array $Parameters;

        function __construct($baseUrl, $basePath, $path, $genericPath, $version, $controller, $method, $filter, $filter2, $parameters) {
            $this->BaseUrl = $baseUrl;
            $this->BasePath = $basePath;
            $this->Path = $path;
            $this->FullPath = $baseUrl.$path;
            $this->GenericPath = $genericPath;
            $this->Version = $version;
            $this->Controller = $controller;
            $this->Method = $method;
            $this->Filter = $filter;
            $this->Filter2 = $filter2;
            $this->Parameters = $parameters;
        }

        public function jsonSerialize() {
            return array(
                'baseUrl' => $this->BaseUrl,
                'basePath' => $this->BasePath,
                'path' => $this->Path,
                'genericPath' => $this->GenericPath,
                'version' => $this->Version,
                'controller' => $this->Controller,
                'method' => $this->Method,
                'filter' => $this->Filter,
                'parameters' => $this->Parameters
            );
        }
    }
?>
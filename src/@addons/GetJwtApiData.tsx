import { useEffect } from 'react'
import ls from 'localstorage-slim';

// https://stackoverflow.com/questions/73028500/how-to-get-fetch-api-to-render-json-data-in-react
export default function GetJwtApiData<T>(
  url: string|null,
  propertySelector: string|null,
  dataSetterCallback: any,
  dependencyList: any[],
  obj: { new(a: any) : T},
  completionCallback?:(data?:any|null) => void,
  cacheDurationInSeconds: number|null = 300
): void {

    useEffect(() => {

        if(url == null){
            return;
        }

        // Retrieve the cached JSON response
        let cachedJson:any = ls.get(url);
        if (cachedJson != null) {

            if(propertySelector != null) {
                cachedJson = cachedJson[propertySelector];
            }

            var data = null;
            if(dataSetterCallback != null) {
                if(cachedJson != null){
                    if(Array.isArray(cachedJson)){

                        data = cachedJson.map((listItem: any) => { return new obj(listItem) }) || [];

                    } else {

                        data = new obj(cachedJson);
                    }
                }

                dataSetterCallback(data);
            } else {

                data = cachedJson;
            }

            if(completionCallback != null) { 
                completionCallback(data);
            }

        } else {

            fetch(url,  {
                headers: {
                'jwt-auth': process.env.REACT_APP_JWT ?? "",
                }
            })
            .then((response) => response.json())
            .then(json => {

                // Check for a null response
                if(json == null){

                    dataSetterCallback(null);
                    return;
                }

                // Cache the JSON response
                ls.set(url, json, { ttl: cacheDurationInSeconds });

                if(propertySelector != null) {              
                    json = json[propertySelector];
                }

                var data = null;
                if(dataSetterCallback != null) { 
                    if(json != null){

                        if(Array.isArray(json)){

                            data = json.map((listItem: any) => { return new obj(listItem) }) || [];
            
                        } else {
            
                            data = new obj(json);        
                        }
                    }
                
                    dataSetterCallback(data);
                    
                } else {

                    data = json;
                }

                return data;
            })
            .then((data) =>{if(completionCallback != null) { completionCallback(data) }});
        }
    }, dependencyList);
}
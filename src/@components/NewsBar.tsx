import { useState } from 'react'
import GetJwtApiData from 'addons/GetJwtApiData'

import NewsBarItem from 'classes/NewsBarItem'

const NewsBar = (): JSX.Element => {

    const [newsBarItems, setNewsBarItems] = useState<Array<NewsBarItem>>([]);

    const newsUrl = (process.env.REACT_APP_BASEURL ?? "") + "/news";

    GetJwtApiData<NewsBarItem>(
        newsUrl, 
        "newsItems", 
        setNewsBarItems,
        [],
        NewsBarItem
      );

    var NewsBar = <></>;
    
    if(newsBarItems.length > 0 && newsBarItems[0].Message != null){

        NewsBar = <div className="newsBar">{newsBarItems[0].Message}</div>;
    }

    return NewsBar;
};

export default NewsBar;
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import StringToJSX from 'addons/StringToJSX'

export default class NewsBarItem {

    public readonly Message: JSX.Element;

    private ParseDate(message:string|null):string {

        if(message == null || message.trim().length < 1) { 
            return "";
        }

        // Check for an embedded datetime
        const dateTimeRegex = /<datetime\swhen=(?:'|")(20\d{2}-(?:0[0-9]|1[0-2])-(?:3[0-1]|[0-2][0-9])\s(?:2[0-3]|[0-1][0-9]):[0-5][0-9]:[0-5][0-9])(?:'|")\s?\/>/g;
        const dateTimeExtracted = [...message.matchAll(dateTimeRegex)];
        if(dateTimeExtracted.length > 0){
            const datetimeAsDuration = dayjs().utc().to(dayjs.utc(dateTimeExtracted[0][1].toString()), true);
            message = message.replace(dateTimeRegex, "<em>" + datetimeAsDuration + "</em>");
        }

        return message;
    }

    public constructor(newsBarItem: any){

        this.Message = <StringToJSX>{this.ParseDate(newsBarItem.message)}</StringToJSX>;
    }
}
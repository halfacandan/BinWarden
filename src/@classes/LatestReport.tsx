import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export default class LatestReport {

    public LastBlackBin: Date;
    public NextBlackBin: Date;

    public LastGreenBin: Date;
    public NextGreenBin: Date;

    public constructor(latestReport: any){

        this.LastBlackBin = dayjs(latestReport.blackBin?.latest).utc().toDate() ?? dayjs().utc().add(-7, 'day').toDate();
        this.NextBlackBin = dayjs(latestReport.blackBin?.nextAnon).utc().toDate() ?? dayjs().utc().add(-1, 'day').toDate();

        this.LastGreenBin = dayjs(latestReport.greenBin?.latest).utc().toDate() ?? dayjs().utc().add(-7, 'day').toDate();
        this.NextGreenBin = dayjs(latestReport.greenBin?.nextAnon).utc().toDate() ?? dayjs().utc().add(-1, 'day').toDate();
    }

    public CanReportBlackBinsAnonymously(): boolean {

        return this.NextBlackBin <= dayjs.utc().toDate();
    }

    public CanReportGreenBinsAnonymously(): boolean {

        return this.NextGreenBin <= dayjs.utc().toDate();
    }
}
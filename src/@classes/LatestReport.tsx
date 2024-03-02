export default class LatestReport {

    public BlackBin: Date;
    public GreenBin: Date;

    public constructor(latestReport: any){

        this.BlackBin = latestReport.blackBin;
        this.GreenBin = latestReport.greenBin;
    }
}
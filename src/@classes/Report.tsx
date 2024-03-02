export default class Report {

    public YearMonth: string;
    public BlackBin: number;
    public GreenBin: number;

    public constructor(report: any){

        this.YearMonth = report.yearMonth;
        this.BlackBin = report.blackBin * 1;
        this.GreenBin = report.greenBin * 1;
    }

    public toObject(){

        return {
            "yearMonth": this.YearMonth,
            "blackBin": this.BlackBin,
            "greenBin": this.GreenBin
        };
    }  
}
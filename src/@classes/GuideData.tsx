import GuideSection from 'classes/GuideSection';

export default class GuideData {

    public readonly Sections: Array<GuideSection>;
    public readonly ClassName?: string;
    public ExpandedIndex?: number 

    public constructor(guideData: any, anchor?: string|null){

        const sections = guideData.sections.map((section: any, index: number) => new GuideSection(index, section, anchor));

        this.Sections = sections;
        this.ClassName = guideData.className;
        this.ExpandedIndex = (sections.filter((section: GuideSection) => section.Expanded) ?? [])[0]?.Index;
    }
}
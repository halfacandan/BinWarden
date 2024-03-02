import StringToJSX from 'addons/StringToJSX'

export default class GuideSection {

    public readonly Index: number;
    public readonly Title: string;
    public readonly Body: JSX.Element;
    public readonly Expanded: boolean;
    public readonly Anchor: string;
    public readonly AnchorName: string;

    public constructor(index: number, guideSection: any, anchor?: string|null){

        const guideSectionAnchorName = guideSection.title.replace(/\s/g, "_").replace(/[^a-zA-Z0-9_]/g,"");
        const guideSectionAnchor = "#" + guideSectionAnchorName;

        this.Index  = index;
        this.Title = guideSection.title;
        this.Body = (typeof guideSection.body) === "string" ? <StringToJSX>{guideSection.body}</StringToJSX> : guideSection.body;
        this.Expanded = anchor == guideSectionAnchor;
        this.Anchor = guideSectionAnchor
        this.AnchorName = guideSectionAnchorName
    }
}
import { createElement } from 'react';

// 🙏 https://stackoverflow.com/a/58626638/12104850

const getNodes = (str: string): NodeListOf<ChildNode> =>
  new DOMParser().parseFromString(str, 'text/html').body.childNodes;

const createJSX: any = (nodeArray: HTMLElement[] | ChildNode[]) => {
  
  return nodeArray.map((node: HTMLElement|ChildNode, idx: number) => {

    let attributeObj:any = {};
    const { attributes, localName, childNodes, nodeValue } = node as HTMLElement;

    if (attributes) {
      Array.from(attributes).forEach((attribute) => {
        if (attribute.name === 'style') {

          let styleAttributes = attribute.nodeValue?.split(';');
          let styleObj:any = {};

          styleAttributes?.forEach((attribute) => {
            let [key, value] = attribute.split(':');
            styleObj[key] = value;
          });

          attributeObj[attribute.name] = styleObj;

        } else {

          attributeObj[attribute.name] = attribute.nodeValue;
        }
      });
    }

    return localName
      ? (localName == "br" || localName == "img") ? createElement(localName, { ...attributeObj, key: idx }) : createElement(
          localName,
          { ...attributeObj, key: idx },
          childNodes && Array.isArray(Array.from(childNodes))
            ? createJSX(Array.from(childNodes))
            : []
        )
      : nodeValue;
  });
};

export default function StringToJSX({ children }:{ children:string }) {

  return createJSX(Array.from(getNodes(children)));
};
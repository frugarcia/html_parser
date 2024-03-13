// Dependencies
const data = require("./data.cjs");
const htmlParser = require("node-html-parser");
const fs = require("fs");

const root = htmlParser.parse(data);
const mainNav = root.querySelector("#mainNav");

const valid = mainNav.childNodes.filter((child) => {
  return child.childNodes.length > 1;
});

function getChilds(node) {
  return node.map((child) => {
    const firstChild = child?.childNodes?.[0];
    const secondChild = child?.childNodes?.[1];
    const firstChildTagName = firstChild?.tagName;
    const secondChildTagName = secondChild?.tagName;

    if (firstChildTagName === "A" && !secondChild) {
      return {
        label: firstChild.text,
        href: firstChild.attributes.href,
      };
    } else if (firstChildTagName === "A" && secondChildTagName === "UL") {
      return {
        label: firstChild.text,
        href: firstChild.attributes.href,
        children: getChilds(secondChild.childNodes).flat(),
      };
    } else if (child.attributes?.class === "row") {
      return getChilds(child.childNodes);
    } else {
      return getChilds(child.childNodes)[0];
    }
  });
}

const result = getChilds(valid);
const stringify = JSON.stringify(result);
fs.writeFile("./finalData.json", stringify, "utf8", () => {
  console.log("File saved");
});

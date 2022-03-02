const htmlToDom = require("./htmlToDom.js");
const { fsReader, fsWriter } = require("./fileSystem.js");

function entryDomToJSON(entryDom) {
  //   console.log("entryDom", entryDom.querySelector("title").textContent);
  const id = entryDom.querySelector("id").textContent;
  const created_at = entryDom.querySelector("published").textContent;
  const updated_at = entryDom.querySelector("updated").textContent;
  const title = entryDom.querySelector("title").textContent;
  const content = entryDom.querySelector("content").textContent;
  const orange_link = entryDom.querySelector("link[rel='alternate']")?.href;
  const tags = [
    ...entryDom.querySelectorAll(
      "category[scheme='http://www.blogger.com/atom/ns#']"
    ),
  ].map((category) => category.getAttribute("term"));

  return {
    id,
    created_at,
    updated_at,
    title,
    content,
    orange_link,
    tags,
  };
}

function JSONToMarkdown({
  id,
  created_at,
  updated_at,
  title,
  content,
  orange_link,
  tags,
}) {
  return {
    id,
    markdown: `---
title: ${title}
date: ${created_at}
tags: 
${tags.map((tag) => `- ${tag}`).join("\n")}
categories:
- 舊部落格移植文章
---

# ${title}

原文連結: ${orange_link}
移植時的最後更新日期: ${updated_at}

${content}
`,
  };
}

function entryToId(entryDom) {
  return [...entryDom.querySelectorAll("id")].map((dom) => dom.textContent);
}
function filterPost(dom) {
  return [...dom.querySelectorAll("entry")].filter((entryDom) =>
    entryDom.querySelector("id").textContent.includes("post")
  );
}
function findEntryIndex(title) {
  return function (dom) {
    return [...dom.querySelectorAll("entry")]
      .map((dom, index) => ({
        title: dom.querySelector("title").textContent,
        index,
      }))
      .filter((item) => item.title === title);
  };
}

fsReader("./data.xml")
  .then(htmlToDom)
  .then(filterPost)
  //   .then(findEntryIndex("一年後的.....修車（去waler那）")) // for dev
  //   .then(entryToId) // for dev
  .then((array) => {
    console.log(array.length);
    return Promise.all(
      array
        .map(entryDomToJSON)
        .map(JSONToMarkdown)
        .map(({ id, markdown }) => {
          const id2 = id.split("post-").pop();
          return { id: id2, markdown };
        })
        .map(({ id, markdown }) => fsWriter(`${id}.md`, markdown))
    );
  })
  //   .then(entryDomToJSON)
  //   .then(JSONToMarkdown)
  //   .then(({ id, markdown }) => fsWriter(`${id}.md`, markdown))
  .then(console.log)
  .catch(console.log);

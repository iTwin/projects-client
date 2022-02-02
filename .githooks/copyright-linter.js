/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

function getFileNames(lintAll) {
  // Default to get name of every file changed, added, or renamed (excluding deleted files) between last commit and current
  let diffCommand = "git diff --name-only --diff-filter=d -l0 HEAD~1";

  // If specified, get name of every file in repo instead
  if (lintAll)
    diffCommand = "git ls-files";

  return child_process.execSync(diffCommand)
    .toString()
    .split("\n")
    // Append path name, accidentally "double counts" directory names between this file and root
    .map(f => path.join(__dirname, "..", f))
    .filter(f => /\.(js|ts|tsx|scss|css)$/.test(f));
}

function getCopyrightBanner(useCRLF) {
  const eol = (useCRLF) ? "\r\n" : "\n";
  return `/*---------------------------------------------------------------------------------------------${eol}* Copyright (c) Bentley Systems, Incorporated. All rights reserved.${eol}* See LICENSE.md in the project root for license terms and full copyright notice.${eol}*--------------------------------------------------------------------------------------------*/${eol}`;
}

const longCopyright = "/?/[*](?:(?![*]/)(\\s|\\S))*Copyright(\\s|\\S)*?[*]/.*(\n|\r\n)";
// Regex breakdown: select comments that contain the word Copyright
const shortCopyright = "//\\s*Copyright.*(\n|\r\n)";

const oldCopyrightBanner = RegExp(
  `^(${longCopyright})|(${shortCopyright})`,
  "m" // Lack of 'g' means only select the first match in each file
);

// If '--all' is passed-in all files will be linted
// otherwise only files changed last commit and currently will be linted
const filePaths = getFileNames(process.argv.includes("--all"))

if (filePaths) {
  filePaths.forEach((filePath) => {
    let fileContent = fs.readFileSync(filePath, { encoding: "utf8" });
    const lastNewlineIndex = fileContent.lastIndexOf("\n");
    const copyrightBanner = getCopyrightBanner(lastNewlineIndex > 0 && fileContent[lastNewlineIndex - 1] === "\r");

    // up-to-date
    if (fileContent.startsWith(copyrightBanner))
      return;

    fileContent = fileContent.replace(
      oldCopyrightBanner,
      copyrightBanner
    );
    if (!fileContent.includes(copyrightBanner)) {
      fileContent = copyrightBanner + fileContent;
    }
    fs.writeFileSync(filePath, fileContent);
  });
}

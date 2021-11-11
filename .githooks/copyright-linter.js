/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

function getFileNames(stagedFilesOnly) {
  // Grab only staged files, otherwise grab all files changed relative to main/master

  // 1. Simplest method:
  // 2. Silently add using single commit:
  // const diffCommand = "git diff --name-only " + (stagedFilesOnly ? "--staged" : "main");


  // 3. Silently add using separate commit (pre-commit version):
  // const diffCommand = "git stash show --name-only" + (stagedFilesOnly ? "" : "; git diff --name-only main");


  // 4. Silently add using separate commit (post-commit version):
  // 5. Use --amend:
  // Command must be changed if primary branch name is 'master' not 'main'
  const diffCommand = "git diff --name-only " + (stagedFilesOnly ? "HEAD~1" : "main");

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

/* Regex breakdown: select block comments if they contain the word Copyright
* /?/[*] : finds either //* or /*
* (?:(?![*]/)(\\s|\\S))* : match all symbols (\s whitespace, \S non-whitespace) that are not comment block closers * /
* Copyright(\\s|\\S)*? : match Copyright and all symbols until the next comment block closer * /
* .*(\n|\r\n) : match all characters and the next newline
*/
const longCopyright = "/?/[*](?:(?![*]/)(\\s|\\S))*Copyright(\\s|\\S)*?[*]/.*(\n|\r\n)";
// Regex breakdown: select comments that contain the word Copyright
const shortCopyright = "//\\s*Copyright.*(\n|\r\n)";

const oldCopyrightBanner = RegExp(
  `^(${longCopyright})|(${shortCopyright})`,
  "m" // Lack of 'g' means only select the first match in each file
);

// If '--branch' is passed-in all files changed since main/master will be linted
// otherwise only currently staged files will be linted
const filePaths = getFileNames(!process.argv.includes("--branch"))

if (filePaths) {
  filePaths.forEach((filePath) => {
    let fileContent = fs.readFileSync(filePath, { encoding: "utf8" });
    const lastNewlineIdx = fileContent.lastIndexOf("\n");
    const copyrightBanner = getCopyrightBanner(lastNewlineIdx > 0 && fileContent[lastNewlineIdx - 1] === "\r");

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

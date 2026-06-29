import fse from "fs-extra";
import path from "path";

// DO NOT DELETE THIS FILE
// This file is used by build system to build a clean npm package with the
// compiled js files in the root of the package.
// It will not be included in the npm package.
const createPackageJson = () => {
    // copy package file into destination folder
    const pkgSrc = path.join(process.cwd(), "package.json");
    const source = fse.readFileSync(pkgSrc).toString("utf-8");
    const sourceObj = JSON.parse(source);

    // remove scripts and devdependencies
    sourceObj.scripts = {};
    sourceObj.devDependencies = {};

    const pkgDest = path.join(process.cwd(), "lib", "package.json");
    console.log(`writing ${pkgSrc} to ${pkgDest}`);
    const pkgSrcBuffer = Buffer.from(JSON.stringify(sourceObj, null, 2), "utf-8");
    fse.writeFileSync(pkgDest, pkgSrcBuffer as never);

    console.log("package.json file created");
};
const createIgnoreFile = () => {
    const ignoreSrc = path.join(process.cwd(), ".npmignore");
    const ignoreDest = path.join(process.cwd(), "lib", ".npmignore");
    console.log(`writing ${ignoreSrc} to ${ignoreDest}`);

    const ignoreFile = fse.readFileSync(ignoreSrc).toString("utf-8");
    const src = Buffer.from(ignoreFile, "utf-8");
    fse.writeFileSync(ignoreDest, src as never);

    console.log("ignore file created");
};

const copyReadme = () => {
    const readmeSrc = path.join(process.cwd(), "README.md");
    const readmeDest = path.join(process.cwd(), "lib", "README.md");
    console.log(`writing ${readmeSrc} to ${readmeDest}`);

    const ignoreFile = fse.readFileSync(readmeSrc).toString("utf-8");
    const src = Buffer.from(ignoreFile, "utf-8");
    fse.writeFileSync(readmeDest, src as never);

    console.log("readme file created");
};

export class PackageBuilder {
    static main() {
        console.log("Beginning Build");
        createPackageJson();
        createIgnoreFile();
        copyReadme();
    }
}

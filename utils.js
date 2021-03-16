'use strict'
const vscode = require('vscode');
const fse = require('fs-extra');
const fs = require('fs');
const path = require('path');

function logger(type, msg = '') {
  switch (type) {
    case 'success':
      return vscode.window.setStatusBarMessage(`Success: ${msg}`, 5000);
    case 'warning':
      return vscode.window.showWarningMessage(`Warning: ${msg}`);
    case 'error':
      return vscode.window.showErrorMessage(`Failed: ${msg}`);
  }
}

module.exports = {
  logger,
  generators: {
    templatesDir: path.join(__dirname, '/templates'),
    createFile: (file, data) =>
      new Promise(resolve => {
        let output = fse.outputFile(file, data);
        resolve(output);
      }),
    resolveWorkspaceRoot: path =>
      path.replace('${workspaceFolder}', vscode.workspace.rootPath),

    createIndexHtml(projectDir, projectName) {
      let templateFileName = `${this.templatesDir}/ozoneHtml.template`;
      let fileContent = fs
        .readFileSync(templateFileName)
        .toString()
        .replace(/{projectName}/g, projectName);
      
      let fileName = `${projectDir}/${projectName}.html`;
      console.log(fileName);
      
      return this.createFile(fileName, fileContent);
    },

    createCss(projectDir, projectName, cssFileName) {
      let templateFileName = `${this.templatesDir}/${cssFileName}.template`;
      let fileContent = fs
        .readFileSync(templateFileName)
        .toString()
        .replace(/{projectName}/g, projectName);
      
      let fileName;
      switch(cssFileName) {
        case 'ozoneCommonLess':
          fileName = `${projectDir}/styles/common.less`;
          break;
        case 'ozoneBaseCss':
          fileName = `${projectDir}/styles/base.css`;
          break;
        case 'ozoneIndexless':
          fileName = `${projectDir}/styles/${projectName}.less`;
          break;
      }

      return this.createFile(fileName, fileContent);
    },

    createIndexjs(projectDir, projectName, jsFileName) {
      let templateFileName = `${this.templatesDir}/${jsFileName}.template`;
      let fileContent = fs
      .readFileSync(templateFileName)
      .toString()
      .replace();

      let fileName = `${projectDir}/scripts/${projectName}.js`;
      
      return this.createFile(fileName, fileContent);
    }
  }
}
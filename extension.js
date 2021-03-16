'use strict';
const vscode = require('vscode');
const utils = require('./utils');
const { logger, generators } = utils;

function activate(context) {
  let createComponent = (uri, type) => {
    console.log('create-ozone-template activated...');
    // 输入组件名字
    new Promise(resolve =>
      vscode.window
        .showInputBox({
          prompt: 'Enter project name'
        })
        .then(inputValue => resolve(inputValue))
    )
      .then(val => {
        // 得到用户输入的项目名字
        // 判断是否为空
        if (val.length === 0) {
          logger('error', 'Project name can not be empty!');
          throw new Error('Project name can not be empty!');
        }

        let projectName = val; // 传入的项目名
        let projectDir = uri.fsPath; // 项目根路径

        return Promise.all([
          generators.createIndexHtml(projectDir, projectName),
          generators.createCss(projectDir, projectName, 'ozoneBaseCss'),
          generators.createCss(projectDir, projectName, 'ozoneCommonLess'),
          generators.createCss(projectDir, projectName, 'ozoneIndexless'),
          generators.createIndexjs(projectDir, projectName, 'ozoneIndexjs'),
        ]);
      })
      .then(
        () => logger('success', 'React component successfully created!'),
        err => logger('error', err.message)
      );
  };
  // 注册命令
  const componentsList = [
    {
      type: 'ozone',
      commandID: 'extension.createOzoneTemplate'
    },
  ];

  componentsList.forEach(comp => {
    let type = comp.type;
    let disposable = vscode.commands.registerCommand(comp.commandID, uri => {
      // uri是触发命令时的文件夹路径信息对象
      console.log(uri);
      createComponent(uri, type);
    });
    context.subscriptions.push(disposable);
  });
}

/**
 * 插件被激活时触发，所有代码总入口
 * @param {*} context 插件上下文
 */
 module.exports = {
  activate
};

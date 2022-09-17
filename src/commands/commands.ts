import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import * as vscode from 'vscode';
import JsonToTS from 'json-to-ts';
import { getSelectedText, getViewColumn, parseJson } from '../tools/utils';
import request from '../request/request';
import { API2TS_CONFIG_KEY } from '../tools/const';

const jsonFormat = require('json-format');
interface ApiConfig {
  token: string
  baseURL: string
}

/**
 * 文本select后 请求接口 转ts
 */
export const transformFromSelection
  = (context: vscode.ExtensionContext) => async () => {
    const config: ApiConfig = context.globalState.get(API2TS_CONFIG_KEY) ?? {
      token: '',
      baseURL: '',
    };
    console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', config);

    const tmpFilePath = path.join(os.tmpdir(), 'api-to-ts.ts');
    const tmpFileUri = vscode.Uri.file(tmpFilePath);

    const params = await parseJson(getSelectedText());

    const json = await request({
      ...params,
      ...config,
    });

    const interfaces = JsonToTS(json.data);

    fs.writeFileSync(tmpFilePath, interfaces.join('\n'));

    vscode.commands.executeCommand('vscode.open', tmpFileUri, getViewColumn());
  };

/**
 * 文本select后 请求接口 查看响应数据
 */
export const transformResponse
  = (context: vscode.ExtensionContext) => async () => {
    const config: ApiConfig = context.globalState.get(API2TS_CONFIG_KEY) ?? {
      token: '',
      baseURL: '',
    };
    console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', config);

    const tmpFilePath = path.join(os.tmpdir(), 'api-to-ts.json');
    const tmpFileUri = vscode.Uri.file(tmpFilePath);

    const params = await parseJson(getSelectedText());

    const json = await request({
      ...params,
      ...config,
    });

    // 输出响应式数据 会json美化
    fs.writeFileSync(tmpFilePath, jsonFormat(json.data));

    vscode.commands.executeCommand('vscode.open', tmpFileUri, getViewColumn());
  };

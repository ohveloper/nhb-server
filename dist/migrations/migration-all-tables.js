"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
//? 모든 마이그레이션 파일을 한꺼번에 마이그레이트 해주는 명령어를 만드는 모듈
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process"); //? 새로운 프로세스를 생성하여 실행하는 node.js 내장 모듈
const util = __importStar(require("util")); //? 역시 내장 모듈
const asyncExec = util.promisify(child_process_1.exec); //? 위 child_process 모듈의 exec을 이용해 반복문으로 프로세스를 생성할 때 비동기를 동기로 바꿔줄 때 필요
console.log("migration-all-table");
console.log(`
  --------------------------------------
  +++Laggard Project Migration Start+++
  --------------------------------------
`);
let migrationAllTable = async () => {
    let migrationFiles = [];
    //? 파일 시스템으로 디렉토리 자체를 읽어온다.
    fs.readdir(path.join(__dirname, "/", "create-table"), async (err, files) => {
        if (err)
            console.log("err : ", err);
        if (files) {
            //? 읽어온 파일들의 이름을 하나씩 배열에 담아준다.
            files.forEach(el => {
                migrationFiles.push(el);
            });
            //? 배열에 담은 파일의 이름을 이용해 마이그레이션 실행
            for (let el of migrationFiles) {
                console.log("Migration File Name : ", el);
                const { stdout, stderr } = await asyncExec(`./node_modules/.bin/ts-node "${__dirname}/create-table/${el}"`);
                if (stdout)
                    console.log(stdout);
                if (stderr)
                    console.error("Std Err : ", stderr);
            }
        }
    });
};
migrationAllTable();

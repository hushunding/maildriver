import { HttpCmdSvr } from "./cmdsrv/httpCmdSvr";

// 命令行入口，需要启动浏览器

const cmdsrv = new HttpCmdSvr();
setup(cmdsrv).start();


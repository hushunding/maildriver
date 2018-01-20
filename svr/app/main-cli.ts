import { HttpCmdChn } from "./cmdsrv/httpCmdChn";
import  {setup } from "./route"

// 命令行入口，需要启动浏览器

const cmdchn = new HttpCmdChn();
setup(cmdchn)
cmdchn.start();


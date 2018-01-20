import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { IMailAccountCmd } from '../../share/ICmdChn'

@Injectable()
export class AccountServerService {
  userset = new Map<string, string>();
  userList = new Array<IMailAccountCmd>();

  get defaultAccount(): IMailAccountCmd {
    return Object.assign({}, { user: "", password: "", host: "", tls: false, port: 143 })
  }

  constructor(public snackBar: MatSnackBar) {
    let locuserstorage = localStorage.getItem('userList')
    if (locuserstorage) {
      this.userList = JSON.parse(locuserstorage);
      this.userList.map(user => this.userset.set(user.user, user.password));
    }
    else {
      localStorage.setItem('userList', JSON.stringify([]));
    }
  }
  get LastUser() {
    let lastuserIndexstr = localStorage.getItem('lastuser')
    if (lastuserIndexstr) {
      return JSON.parse(lastuserIndexstr) as IMailAccountCmd;
    }
    else {
      return this.defaultAccount;
    }
  }
  set LastUser(account: IMailAccountCmd) {
    localStorage.setItem('lastuser', JSON.stringify(account));
  }

  get AutoLogin() {
    let autologin = localStorage.getItem('autologin')
    if (autologin) {
      return JSON.parse(autologin) as boolean
    }
    else {
      return false
    }
  }
  set AutoLogin(v) {
    localStorage.setItem('autologin', JSON.stringify(v));
  }

  adduser(account: IMailAccountCmd) {
    if (account.user === "" || account.password === "") {
      this.snackBar.open('用户名密码不能为空', "", { duration: 2000 })
    }
    else if (this.userset.has(account.user)) {
      this.snackBar.open('用户名已存在', "", { duration: 2000 })
    } else {
      this.userset.set(account.user, account.password);
      this.userList.push(account);
      localStorage.setItem('userList', JSON.stringify(this.userList));
    }
  }
  checkuser({ user, password }: IMailAccountCmd) {
    if (!this.userset.has(user)) {
      this.snackBar.open('用户名不存在', "", { duration: 2000 })
      return false;
    }
    else if (!(this.userset.get(user) === password)) {
      this.snackBar.open('密码错误', "", { duration: 2000 })
      return false;
    }
    else {
      return true;
    }
  }
  findFullUser(user: string) {
    for (const account of this.userList) {
      if (account.user === user) {
        return account;
      }
    }
    return this.defaultAccount;
  }



}

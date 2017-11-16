import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

export interface Account { username: string; password: string }
@Injectable()
export class AccountServerService {
  userset = new Map<string, string>();
  userList = new Array<Account>();


  constructor(public snackBar: MatSnackBar) {
    let locuserstorage = localStorage.getItem('userList')
    if (locuserstorage) {
      this.userList = JSON.parse(locuserstorage);
      this.userList.map(user => this.userset.set(user.username, user.password));
    }
    else {
      localStorage.setItem('userList', JSON.stringify([]));
    }
  }
  get LastUser() {
    let lastuserIndexstr = localStorage.getItem('lastuser')
    if (lastuserIndexstr) {
      return JSON.parse(lastuserIndexstr) as Account;
    }
    else {
      return { username: "", password: "" };
    }
  }
  set LastUser(account: Account) {
    localStorage.setItem('lastuser', JSON.stringify({ username: account.username, password: "" }));
  }
  adduser({ username, password }: Account) {
    if (username === "" || password === "") {
      this.snackBar.open('用户名密码不能为空', "", { duration: 2000 })
    }
    else if (this.userset.has(username)) {
      this.snackBar.open('用户名已存在', "", { duration: 2000 })
    } else {
      this.userset.set(username, password);
      this.userList.push({ username, password });
      localStorage.setItem('userList', JSON.stringify(this.userList));
    }
  }
  checkuser({ username, password }: Account) {
    if (!this.userset.has(username)) {
      this.snackBar.open('用户名不存在', "", { duration: 2000 })
      return false;
    }
    else if (!(this.userset.get(username) === password)) {
      this.snackBar.open('密码错误', "", { duration: 2000 })
      return false;
    }
    else {
      return true;
    }
  }


}

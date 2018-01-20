import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar, MatAutocompleteSelectedEvent } from '@angular/material';
import { SignupUserComponent } from '../signup-user/signup-user.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountServerService } from './account-server.service';
import { IMailAccountCmd, ICmdReslut } from '../../share/ICmdChn';
import { CmdChnService } from '../cm-chn/cmd-chn.service';

@Component({
  selector: 'app-login-wind',
  templateUrl: './login-wind.component.html',
  styleUrls: ['./login-wind.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [AccountServerService]
})

export class LoginWindComponent implements OnInit {
  hide = true;

  account: IMailAccountCmd;
  expand = false
  userhint = ""
  AutoLogin = false;
  canAutoLogin = false;
  Recodepassword = false;
  showDetail = false;
  showDetialHiht = '显示IMAP服务信息'
  CheckAccountReslut = ""
  isLoginWindow = true;

  get userList() {
    return this.accoutSvr.userList;
  }

  constructor(public dialog: MatDialog, public snackBar: MatSnackBar, private route: ActivatedRoute,
    private router: Router, private accoutSvr: AccountServerService, private cmdChn: CmdChnService) {


  }

  ngOnInit() {

    this.route.url.subscribe(url => {
      if (url[0].path !== 'login') {
        this.isLoginWindow = false;
      }
    })
    if (this.isLoginWindow) {
      this.account = this.accoutSvr.LastUser;
      this.AutoLogin = this.accoutSvr.AutoLogin
      this.Recodepassword = this.AutoLogin ? true : this.Recodepassword
      this.route.params.subscribe(params => { this.canAutoLogin = JSON.parse(params.canAutoLogin) })
    }
    else {
      this.showDetail = true;
      this.route.params.subscribe(params => { this.account = this.accoutSvr.findFullUser(params.username) })
    }

  }
  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

    if (this.accoutSvr.AutoLogin && this.canAutoLogin) {
      this.signin()
    }
  }
  signup() {
    this.accoutSvr.adduser(this.account);
    // return
    // let dialogRef = this.dialog.open(SignupUserComponent, {
    //   width: '250px',
    //   data: { username: this.username, password: this.password }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   this.username = result.username;
    //   this.password = result.password;
    //   this.adduser(this.username, this.password);
    // });
  }
  signin() {
    if (this.accoutSvr.checkuser(this.account)) {
      if (!this.Recodepassword) {
        this.account.password = ""
      }
      this.accoutSvr.LastUser = this.account;
      this.accoutSvr.AutoLogin = this.AutoLogin;
      this.router.navigate(['main', this.account.user])
    }
  }
  signout() {
    this.router.navigate(['login', false])
  }
  CheckAccount() {
    this.CheckAccountReslut = ""
    this.cmdChn.send<{ cmd: string, arg: ICmdReslut }>('accountTest', this.account)
      .subscribe(
      resp => { this.CheckAccountReslut = JSON.stringify(resp.arg) });
  }
  accountSelect($event: MatAutocompleteSelectedEvent) {
    this.account = this.accoutSvr.findFullUser($event.option.value)
  }
  ClearAccount() {
    this.account = this.accoutSvr.defaultAccount;
  }
}

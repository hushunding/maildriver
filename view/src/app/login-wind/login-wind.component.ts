import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SignupUserComponent } from '../signup-user/signup-user.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login-wind',
  templateUrl: './login-wind.component.html',
  styleUrls: ['./login-wind.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class LoginWindComponent implements OnInit {
  hide = true;
  account = { username: "", password: "" };
  expand = false
  userList = new Array<{ username: string; password: string }>();
  userset = new Map<string, string>();

  adduser(username: string, password: string) {
    if (username === "" || password === "") {
      this.snackBar.open('用户名密码不能为空',"",{ duration: 2000})
    }
    else if (this.userset.has(username)) {
      this.snackBar.open('用户名已存在',"",{ duration: 2000})
    } else {
      this.userset.set(username, password);
      this.userList.push({ username, password });
      localStorage.setItem('userList', JSON.stringify(this.userList));
    }
  }
  constructor(public dialog: MatDialog, public snackBar: MatSnackBar,private route: ActivatedRoute,
    private router: Router) {
    let locuserstorage = localStorage.getItem('userList')
    if (locuserstorage) {
      this.userList = JSON.parse(locuserstorage);
      this.userList.map(user => this.userset.set(user.username, user.password));
    }
    else {
      localStorage.setItem('userList', JSON.stringify([]));
    }
    let lastuserIndexstr = localStorage.getItem('lastuser')
    if (lastuserIndexstr) {
      this.account = JSON.parse(lastuserIndexstr);
    }
  }

  ngOnInit() {
  }
  signup() {
    this.adduser(this.account.username, this.account.password)
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
    if (!this.userset.has(this.account.username)) {
      this.snackBar.open('用户名不存在',"",{ duration: 2000})
    }
    else if (!(this.userset.get(this.account.username) === this.account.password)) {
      this.snackBar.open('密码错误',"",{ duration: 2000})
    }
    else {
      localStorage.setItem('lastuser', JSON.stringify({ username: this.account.username, password: "" }));
      this.router.navigate(['main', this.account.username])
    }
  }
}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SignupUserComponent } from '../signup-user/signup-user.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountServerService } from './account-server.service';

@Component({
  selector: 'app-login-wind',
  templateUrl: './login-wind.component.html',
  styleUrls: ['./login-wind.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [AccountServerService]
})

export class LoginWindComponent implements OnInit {
  hide = true;
  account = { username: "", password: "" };
  expand = false

  get userList() {
    return this.accoutSvr.userList;
  }

  constructor(public dialog: MatDialog, public snackBar: MatSnackBar, private route: ActivatedRoute,
    private router: Router, private accoutSvr: AccountServerService) {
    this.account = accoutSvr.LastUser;

  }

  ngOnInit() {
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
      this.accoutSvr.LastUser = this.account;
      this.router.navigate(['main', this.account.username])
    }
  }
}

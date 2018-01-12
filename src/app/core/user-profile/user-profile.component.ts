import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { RouterModule, Routes , Router} from '@angular/router';
import { AuthService} from '../../auth/auth.service';
import { TokenModel } from '../../auth/token-model';
import { Observable } from 'rxjs/Rx';
import { UserProfileService } from './user-profile.service';


@Component({
  selector: 'ices-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @Output() closeUserProfile = new EventEmitter<boolean>();


  public tokenModel: TokenModel;
  public messageQueue: Array<string> = [];

  constructor(private router: Router,
              private authService: AuthService ,
              private userProfileService: UserProfileService) { }

  userMessage = localStorage.getItem('userMessage');

  editPwdDisplay = false;

  newPwd = '';

  newPwdTemp = '';

  msgs = [];

  editPwd(){
      if(this.newPwd != '' && this.newPwdTemp != ''){
          if(this.newPwd != this.newPwdTemp){
              this.showInfo('error','The two password is inconsistent!');
          }else{
              this.userProfileService.editUserPwd(this.newPwd)
              .subscribe(result =>{
                  const userMessage = localStorage.getItem('userMessage');
                  if(result['status'] == 0){
                      this.authService.appendLogWithContent('', 'pwd', userMessage +' update pwd').subscribe(result => {}, error => { });
                      this.showInfo('success',result['message']);
                  }else{
                      this.showInfo('error',result['message']);
                  }
              },error=>{
                  this.showInfo('error','error');
              });
              this.editPwdDisplay = false;
          }
          this.newPwd = '';
          this.newPwdTemp = '';

      }else{
          this.showInfo('error', 'Please input a password!');
      }
  }

  showInfo(type, message) {
      this.msgs = [];
      this.msgs.push({severity: type, summary: 'Message', detail: message});
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    this.authService.checkToken(token).subscribe(
      data => {
        this.tokenModel = this.authService.tokenModel;
      },
      error => { console.log(error); },
      () => {}
    );
  }

  logout() {
    this.authService.logout().subscribe(
      data => {
        this.router.navigate(['logout']).then(result => {
          this.closeUserProfile.emit(false);
        });
      },
      error => console.log(error),
      () => {
        localStorage.clear();
      }
    );
  }


}

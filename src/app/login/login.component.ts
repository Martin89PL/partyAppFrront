import { UserValidator } from './../validators/user-validator';
import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  isLoggedIn;


  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      'email': [
        null,
        [Validators.email, Validators.min(5)],
        [UserValidator.userExists]
      ],
      'password': [null, Validators.required],
    });
  }

  /**
   * Send login form to service
   */
  onSubmit() {
    this.authService.login(JSON.stringify(this.loginForm.value))
    .subscribe((data: any) => {
      if (data && (data.auth === true)) {
        this.router.navigate(['/party/list']);
      }
    });
  }

}

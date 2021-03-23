import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-access',
  templateUrl: './create-access.component.html',
  styleUrls: ['./create-access.component.scss']
})
export class CreateAccessComponent implements OnInit {
  user_email: string = 'user_email@test.com';

  constructor() { }

  ngOnInit(): void {
  }

  createPassword(newPassword) {
    console.log('new password', newPassword);
  }
}

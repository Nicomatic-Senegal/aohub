import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.scss']
})
export class ActivateAccountComponent implements OnInit {
  constructor(private router:Router, private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit() {
    const key = this.route.snapshot.queryParamMap.get('key');
    console.log(key);

    this.authService.activateCompte(key!).subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigate(["/signin"]);
      },
      error: (err) => {

      }
    })
  }
}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ProjectService } from '../../services/project/project.service';
import { UserService } from '../../services/user/user.service';
import { PartnerDTO } from '../../interfaces/partner.model';
import { Project } from '../../interfaces/project.model';
import { debounceTime, distinctUntilChanged, filter, fromEvent, tap } from 'rxjs';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  token: string;
  totalItems = 0;
  itemPerPage = 4;
  currentPage = 1;
  listProject: Project[] = [];
  currentConnectedUser?: PartnerDTO;
  nbProjectsInProgres: number = 0;
  nbProjectsFinished: number = 0;
  nbProjectsOnHold: number = 0;
  nbProjectsArchived: number = 0;
  selectedStatus: string[] = [];
  selectedMarkets: string[] = [];
  selectedStartDate: string = '';
  selectedEndDate: string = '';
  listMarkets: any;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService) {
      authService.loggedOut();
      this.token = authService.isLogged()!;
  }

  ngOnInit(): void {
    if(window.innerHeight < 600) {
      this.itemPerPage = 2;
    }
    this.loadCurrentConnectedUser();
    this.loadAllMarket();
    this.loadMyProjects(this.currentPage - 1, this.itemPerPage);
  }

  ngAfterViewInit() {
    fromEvent<KeyboardEvent>(this.searchInput.nativeElement,'keyup')
      .pipe(
          filter(Boolean),
          debounceTime(500),
          distinctUntilChanged(),
          tap((event:KeyboardEvent) => {
            this.performSearch(this.currentPage - 1, this.itemPerPage, this.searchInput.nativeElement.value);
          })
      )
      .subscribe();
  }

  performSearch(page: number, size: number, query: string) {
    if (query) {
      this.projectService.getMyParticipations(this.token, page, size, this.selectedMarkets, this.selectedStatus, this.selectedStartDate, this.selectedEndDate, query).subscribe({
        next: (data) => {
          this.listProject = [];
          this.listProject.push(data.projects);
          this.listProject = this.listProject.flatMap(data => data);
          this.totalItems = data.totalCount;
        },
        error: (err) => {
          console.log(err);
        }
      })
    } else {
      this.loadMyProjects(this.currentPage - 1, this.itemPerPage);
    }
  }


  loadCurrentConnectedUser() {
    const userData = localStorage.getItem("currentConnectedUser");
    if (userData) {
      this.currentConnectedUser = JSON.parse(userData);

    } else {
      this.userService.getUser(this.token).subscribe({
        next: (data) => {
          this.currentConnectedUser = data;
        },
        error: (err) => {
          console.log(err);
          this.toastr.error(err.error.detail, "Erreur sur la réception de l'utilisateur connecté", {
            timeOut: 3000,
            positionClass: 'toast-right-right',
         });
        }
      })
    }
  }

  loadMyProjects(page: number, size: number) {
    this.listProject.splice(0, this.listProject.length);
    this.projectService.getMyParticipations(this.token, page, size, this.selectedMarkets, this.selectedStatus, this.selectedStartDate, this.selectedEndDate, '').subscribe({
      next: (data) => {
        this.listProject.push(data.projects);
        this.listProject = this.listProject.flatMap(data => data);

        this.totalItems = data.totalCount;
        this.nbProjectsInProgres = data.totalInProgressCount;
        this.nbProjectsFinished = data.totalFinishedCount;
        this.nbProjectsOnHold = data.totalOnHoldCount;
        this.nbProjectsArchived = data.totalArchivedCount;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur sur la réception de la liste des projets", {
          timeOut: 3000,
          positionClass: 'toast-top-center',
       });
      }
    });
  }

  loadAllMarket() {
    this.projectService.getAllMarkets(this.token).subscribe({
      next: (data) => {
        this.listMarkets = data;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur sur la réception de la liste des marchés", {
          timeOut: 3000,
          positionClass: 'toast-top-right',
       });
      }
    });
  }

  changePage(page: number) {
    if(window.innerHeight < 600) {
      this.itemPerPage = 2;
    }
    this.currentPage = page;
    this.loadMyProjects(this.currentPage - 1, this.itemPerPage);
  }

  displayProjectDetails(id: number) {
    this.router.navigate(['/project-options'], { queryParams: { id: id } });
  }

  sortMyProjects() {
    if(this.selectedMarkets.length === 0 && this.selectedStatus.length === 0 && this.selectedStartDate.length === 0 && this.selectedEndDate.length === 0) {
      this.loadMyProjects(this.currentPage - 1, this.itemPerPage);
    }

    this.listProject.splice(0, this.listProject.length);

    this.projectService.getMyParticipations(this.token, this.currentPage - 1, this.itemPerPage, this.selectedMarkets, this.selectedStatus, this.selectedStartDate, this.selectedEndDate, '').subscribe({
      next: (data) => {
        this.listProject.push(data.projects);

        this.listProject = this.listProject.flatMap(data => data);

        this.totalItems = data.totalCount;
        this.nbProjectsInProgres = data.totalInProgressCount;
        this.nbProjectsFinished = data.totalFinishedCount;
        this.nbProjectsOnHold = data.totalOnHoldCount;
        this.nbProjectsArchived = data.totalArchivedCount;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur sur la réception de la liste des projets", {
          timeOut: 3000,
          positionClass: 'toast-top-right',
       });
      }
    });
  }

  onSelectStatus(status: string) {
    const index = this.selectedStatus.indexOf(status);
    if (index !== -1) {
      this.selectedStatus.splice(index, 1);
    } else {
      this.selectedStatus.push(status);
    }
    this.sortMyProjects();
  }

  onSelectMarket(market: any) {
    const index = this.selectedMarkets.indexOf(market.id);
    if (index !== -1) {
      this.selectedMarkets.splice(index, 1);
    } else {
      this.selectedMarkets.push(market.id);
    }
    this.sortMyProjects();
  }

  onStartDateChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.selectedStartDate = inputElement.value;
    this.sortMyProjects();
  }

  onEndDateChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.selectedEndDate = inputElement.value;
    this.sortMyProjects();
  }

  isStatusSelected(status: string): boolean {
    return this.selectedStatus.includes(status);
  }

  isMarketSelected(market: any): boolean {
    return this.selectedMarkets.includes(market.id);
  }

  formatDate(date: Date | undefined): string {
    if (!date) {
        return '';
    }
    let language = 'fr-Fr';
    if (localStorage.getItem('language') === 'en') {
        language = 'en-En';
    }
    const dateToFormat = new Date(date);
    return dateToFormat.toLocaleString(language, { day: '2-digit', month: 'long', year: 'numeric' });
  }

}

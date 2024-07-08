import {Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { PartnerDTO } from '../interfaces/partner.model';
import { Project } from '../interfaces/project.model';
import { ProjectService } from '../services/project/project.service';
import { UserService } from '../services/user/user.service';
import { EnterpriseDTO } from '../interfaces/enterprise.model';
import { EnterpriseService } from '../services/enterprise/enterprise.service';
import { ChartComponent } from 'ng-apexcharts';
import { ChartOptions, ProjectCurve, series } from '../interfaces/chart-options';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  token: string;
  allProjects: Project[] = [];
  listProject: Project[] = [];
  allEnterprise: EnterpriseDTO[] = [];
  currentConnectedUser?: PartnerDTO;
  nbProjectsInProgress: number = 0;
  nbProjectsFinished: number = 0;
  nbAvailableOpportunities: number = 0;
  nbProjectsArchived: number = 0;
  selectedEnterprise!: number;
  selectedMonth: string[] = [];
  selectedYears: string[] = [];
  projectCurve: ProjectCurve = {
    nbProject: [],
    dates: []
  };
  curveTitle!: string;
  months: string[] = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER" ];
  years = ["2020", "2021", "2022", "2023", "2024"];

  data: any;
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private enterpriseService: EnterpriseService,
    private authService: AuthService,
    private translateService: TranslateService
    ) {
      authService.loggedOut();
      this.token = authService.isLogged()!;
  }

  ngOnInit(): void {
    this.loadCurrentConnectedUser();
    this.loadAllEnterprises();
    this.loadEnterpriseProjects(this.selectedEnterprise);
  }

  rotation(word: any, index: number) {
    return Math.round(Math.random())  * 90;
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
          this.translateService.get(['ERROR_RECEIVE_USER', 'ERROR_TITLE']).subscribe(translations => {
            this.toastr.error(translations['ERROR_RECEIVE_USER'], translations['ERROR_TITLE'], {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            });
          });
        }
      })
    }
    this.selectedEnterprise = this.currentConnectedUser?.enterprise.id!;
  }

  loadAllWords() {
    const listMarket = this.allProjects.map(project => project.markets?.at(0)?.name);
    const listMarketWithOcc = this.countOccurrences(listMarket.filter((str): str is string => str !== undefined));
    const listWord: [string, number][] = Object.entries(listMarketWithOcc);
    return listWord;
  }

  countOccurrences(arr: string[]): { [key: string]: number } {
    return arr.reduce((acc: { [key: string]: number }, str: string) => {
        acc[str] = (acc[str] || 0) + 1;
        return acc;
    }, {});
  }

  loadAllEnterprises() {
    this.enterpriseService.getAllEnterprises().subscribe({
      next: (data) => {
        this.allEnterprise = data;
      },
      error: (err) => {
        console.log(err);
        this.translateService.get(['ERROR_FETCHING_COMPANIES', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_FETCHING_COMPANIES'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      }
    });
  }

  loadEnterpriseProjects(idEnterprise: number) {
    this.listProject.splice(0, this.listProject.length);
    this.nbProjectsArchived = 0;
    this.nbProjectsFinished = 0;
    this.nbProjectsInProgress = 0;
    this.nbAvailableOpportunities = 0;
    this.projectService.getAllProjectsEnterprise(this.token, idEnterprise).subscribe({
      next: (data) => {
        console.log(data)
        this.allProjects = data.projects;
        this.listProject = this.allProjects.slice();
        this.drawCurve();
        this.data = this.loadAllWords().map(function (word) {
          return { text: word[0], value: word[1] * 10};
        });

        this.nbProjectsInProgress = data.totalInProgressCount;
        this.nbProjectsFinished = data.totalFinishedCount;
        this.nbAvailableOpportunities = data.totalAvailableOpportunitiesCount;
        this.nbProjectsArchived = data.totalArchivedCount;
      },
      error: (err) => {
        console.log(err);
        this.translateService.get(['ERROR_FETCHING_PROJECTS', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_FETCHING_PROJECTS'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      }
    });
  }

  loadAllProjects() {
    this.listProject.splice(0, this.listProject.length);
    this.nbProjectsArchived = 0;
    this.nbProjectsFinished = 0;
    this.nbProjectsInProgress = 0;
    this.nbAvailableOpportunities = 0;
    this.projectService.getAllProjectsWithHeaders(this.token).subscribe({
      next: (data) => {
        this.allProjects = data.projects;
        this.listProject = this.allProjects.slice();
        this.drawCurve();
        this.data = this.loadAllWords().map(function (word) {
          return { text: word[0], value: word[1] * 10};
        });

        this.nbProjectsInProgress = data.totalInProgressCount;
        this.nbProjectsFinished = data.totalFinishedCount;
        this.nbAvailableOpportunities = data.totalAvailableOpportunitiesCount;
        this.nbProjectsArchived = data.totalArchivedCount;
      },
      error: (err) => {
        console.log(err);
        this.translateService.get(['ERROR_FETCHING_PROJECTS', 'ERROR_TITLE']).subscribe(translations => {
          this.toastr.error(translations['ERROR_FETCHING_PROJECTS'], translations['ERROR_TITLE'], {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        });
      }
    });
  }

  curveSetup() {
    if (this.selectedYears.length === 0) {
      this.projectCurve.dates = this.years;
      const yearCount: number[] = Array(this.years.length).fill(0);

      this.listProject.forEach(projet => {
        const indexOfYear = this.years.indexOf(projet.createdAt.toString().split('-')[0]);

        if (indexOfYear !== -1)
          yearCount[indexOfYear]++;
      });

      this.projectCurve.nbProject = yearCount;
      this.curveTitle = this.years.toString().replaceAll("[,]", "");
    }
    else if (this.selectedYears.length === 1) {
      this.projectCurve.dates = this.months.map(month => month.substring(0, 3));
      const monthCounts: number[] = Array(12).fill(0);

      this.listProject.forEach(projet => {
        const month = parseInt(projet.createdAt.toString().split('-')[1]) - 1;
        monthCounts[month]++;
      });

      this.projectCurve.nbProject = monthCounts;
      this.curveTitle = this.selectedYears[0];
    }
    else {
      this.projectCurve.dates = this.selectedYears.sort((a, b) => parseInt(a) - parseInt(b));
      const yearCount: number[] = Array(this.selectedYears.length).fill(0);

      this.listProject.forEach(projet => {
        const indexOfYear = this.selectedYears.indexOf(projet.createdAt.toString().split('-')[0]);

        if (indexOfYear !== -1)
          yearCount[indexOfYear]++;
      });

      this.projectCurve.nbProject = yearCount;

      this.curveTitle = this.selectedYears.toString().replaceAll("[,]", "");
    }
  }

  drawCurve() {
    this.curveSetup();

    this.chartOptions = {
      series: [
        {
          name: "Marché",
          data: this.projectCurve.nbProject
        }
      ],
      chart: {
        type: "area",
        height: 390,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },

      title: {
        text: "Analyse des projets",
        align: "left"
      },
      subtitle: {
        text: this.curveTitle,
        align: "left"
      },
      labels: this.projectCurve.dates,
      xaxis: {
        type: "category"
      },
      yaxis: {
        opposite: true
      },
      legend: {
        horizontalAlign: "left"
      }
    };
  }

  isMonthSelected(month: string): boolean {
    return this.selectedMonth.includes(month);
  }

  isYearSelected(year: string): boolean {
    return this.selectedYears.includes(year);
  }

  isEnterpriseSelected(enterprise: number): boolean {
    return this.selectedEnterprise === enterprise;
  }

  isAllSelected(): boolean {
    return this.selectedYears.length === this.years.length;
  }

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.deselectAll();
    } else {
      this.selectAll();
    }
  }

  selectAll(): void {
    this.selectedYears = [...this.years];
    if (this.selectedEnterprise == -1) {
      this.loadAllProjects();
    } else {
      this.loadEnterpriseProjects(this.selectedEnterprise);
    }
  }

  deselectAll(): void {
    this.selectedYears = [];
    if (this.selectedEnterprise == -1) {
      this.loadAllProjects();
    } else {
      this.loadEnterpriseProjects(this.selectedEnterprise);
    }
  }

  sortProjectsByMonth(month: string) {
    const index = this.selectedMonth.indexOf(month);
    if (index !== -1) {
      this.selectedMonth.splice(index, 1);
    } else {
      this.selectedMonth.push(month);
    }

    if (this.selectedMonth.length === 0) {
      this.loadEnterpriseProjects(this.selectedEnterprise);
    } else {
      this.listProject = this.allProjects.filter(project => {
        console.log(project.createdAt.toString().split("-")[1]);
        console.log(parseInt(project.createdAt.toString().split("-")[1]));
        console.log(this.selectedMonth.includes(this.months[parseInt(project.createdAt.toString().split("-")[1]) - 1]));
        return this.selectedMonth.includes(this.months[parseInt(project.createdAt.toString().split("-")[1]) - 1])});
    }
  }

  sortProjectsByYear(year: string) {
    const index = this.selectedYears.indexOf(year);
    if (index !== -1) {
      this.selectedYears.splice(index, 1);
    } else {
      this.selectedYears.push(year);
    }

    if (this.selectedYears.length === 0) {
      if (this.selectedEnterprise == -1) {
        this.loadAllProjects();
      } else {
        this.loadEnterpriseProjects(this.selectedEnterprise);
      }

    } else {
      this.nbProjectsArchived = 0;
      this.nbProjectsFinished = 0;
      this.nbProjectsInProgress = 0;
      this.nbAvailableOpportunities = 0;
      this.listProject = this.allProjects.filter(project => this.selectedYears.includes(project.createdAt.toString().split("-")[0]));
      this.listProject.forEach(project => {
        switch(project.status) {
          case 'IN_PROGRESS':
            this.nbProjectsInProgress++;
            break;
          case 'FINISHED':
            this.nbProjectsFinished++;
            break;
          case 'ON_HOLD':
            this.nbAvailableOpportunities++;
            break;
          case 'ARCHIVED':
            this.nbProjectsArchived++;
            break;
          default:
            break;
        }
      });
      this.drawCurve();
    }
  }

  sortProjectsByEnterprise(id: number) {
    if (this.selectedEnterprise === id) {
      this.selectedEnterprise = -1;
      this.loadAllProjects();
    } else {
      this.selectedEnterprise = id;
      this.loadEnterpriseProjects(this.selectedEnterprise);
    }
  }

  formatDate(date: Date): string {
    let language = 'fr-Fr';
    if(localStorage.getItem('language') === 'en') {
      language = 'en-En';
    }
    const dateToFormat = new Date(date);
    return dateToFormat.toLocaleString(language, { day: '2-digit', month: 'long', year: 'numeric' });
  }

}

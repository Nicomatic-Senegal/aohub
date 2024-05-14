import { Component, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent {
  token: string;
  allProjects: Project[] = [];
  listProject: Project[] = [];
  allEnterprise: EnterpriseDTO[] = [];
  currentConnectedUser?: PartnerDTO;
  nbProjectsInProgres: number = 0;
  nbProjectsFinished: number = 0;
  nbProjectsOnHold: number = 0;
  nbProjectsArchived: number = 0;
  selectedDate: Date | null = new Date();
  selectedEnterprise!: number;
  selectedMonth: string[] = [];
  selectedYears: string[] = [];
  projectCurve: ProjectCurve = {
    nbProject: [],
    dates: []
  };
  months: string[] = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER"
  ];
  years = [
    "2012", "2013", "2014", "2015", "2016", "2017",
    "2018", "2019", "2020", "2021", "2022", "2023", "2024"
  ];

  data: any;
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  data1: any[][] = [
    ['Donnée 1-1', 'Donnée 1-2', 'Donnée 1-3', 'Donnée 1-4', 'Donnée 1-5'],
    ['Donnée 2-1', 'Donnée 2-2', 'Donnée 2-3', 'Donnée 2-4', 'Donnée 2-5'],
    // Ajoutez d'autres lignes de données ici
  ];

  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private enterpriseService: EnterpriseService,
    private authService: AuthService) {
      authService.loggedOut();
      this.token = authService.isLogged()!;

      this.chartOptions = {
        series: [
          {
            name: "Marché",
            data: series.monthDataSeries1.prices
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
          text: "Analyse des marchés",
          align: "left"
        },
        subtitle: {
          text: "Les marchés",
          align: "left"
        },
        labels: series.monthDataSeries1.dates,
        xaxis: {
          type: "datetime"
        },
        yaxis: {
          opposite: true
        },
        legend: {
          horizontalAlign: "left"
        }
      };
  }

  ngOnInit(): void {
    this.loadCurrentConnectedUser();
    this.loadAllEnterprises();

    console.log(this.loadAllWords());

    this.data = this.loadAllWords().map(function (d) {
        return { text: d, value: 20};
      });

    // Highcharts.chart('container', this.options);
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
          this.toastr.error(err.error.detail, "Erreur sur la réception de l'utilisateur connecté", {
            timeOut: 3000,
            positionClass: 'toast-right-right',
         });
        }
      })
    }
    console.log(this.currentConnectedUser);

    this.selectedEnterprise = this.currentConnectedUser?.enterprise.id!;
  }

  loadAllWords() {
    return this.allProjects.map(project => project.markets?.at(0)?.name);
  }

  loadAllEnterprises() {
    this.enterpriseService.getAllEnterprises().subscribe({
      next: (data) => {
        this.allEnterprise = data;
        // this.selectedEnterprise = this.allEnterprise[0].id;
        this.loadEnterpriseProjects(this.selectedEnterprise);
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.detail, "Erreur sur la réception de la liste des entreprises", {
          timeOut: 3000,
          positionClass: 'toast-top-center',
       });
      }
    });
  }

  loadEnterpriseProjects(idEnterprise: number) {
    this.listProject.splice(0, this.listProject.length);
    this.nbProjectsArchived = 0;
    this.nbProjectsFinished = 0;
    this.nbProjectsInProgres = 0;
    this.nbProjectsOnHold = 0;
    this.projectService.getAllProjectsEnterprise(this.token, idEnterprise).subscribe({
      next: (data) => {
        console.log(data);

        this.allProjects = data;
        this.listProject = this.allProjects.slice();
        this.data = this.loadAllWords().map(function (d) {
          return { text: d, value: 20};
        });

        this.listProject.forEach(project => {
          switch(project.status) {
            case 'IN_PROGRESS':
              this.nbProjectsInProgres++;
              break;
            case 'FINISHED':
              this.nbProjectsFinished++;
              break;
            case 'ON_HOLD':
              this.nbProjectsOnHold++;
              break;
            case 'ARCHIVED':
              this.nbProjectsArchived++;
              break;
            default:
              break;
          }
        });
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

  isMonthSelected(month: string): boolean {
    return this.selectedMonth.includes(month);
  }

  isYearSelected(year: string): boolean {
    return this.selectedYears.includes(year);
  }

  isEnterpriseSelected(enterprise: number): boolean {
    return this.selectedEnterprise === enterprise;
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
      this.loadEnterpriseProjects(this.selectedEnterprise);
    } else {
      this.listProject = this.allProjects.filter(project => this.selectedYears.includes(project.createdAt.toString().split("-")[0]));
    }
  }

  sortProjectsByEnterprise(id: number) {
    this.selectedEnterprise = id;
    this.loadEnterpriseProjects(this.selectedEnterprise);
  }

}

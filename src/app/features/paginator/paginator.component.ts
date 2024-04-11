import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  @Input() totalItems!: number;
  @Input() currentPage!: number; 
  @Input() itemPerPage!: number; 
  @Output() onClick: EventEmitter<number> = new EventEmitter();
  totalPages = 0;
  pages: number[] = [];

  constructor() {
  }

  ngOnInit() {
    if (this.totalItems) {
      this.totalPages = Math.ceil(this.totalItems / this.itemPerPage);
      this.pages = Array.from({length: this.totalPages}, (_, i) => i + 1);
    }
  }

  pageClicked(page: number) {
    if (page > this.totalPages) return;
    this.onClick.emit(page);
  }

}

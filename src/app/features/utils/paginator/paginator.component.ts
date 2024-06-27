import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit, OnChanges {
  @Input() totalItems!: number;
  @Input() currentPage!: number;
  @Input() itemPerPage!: number;
  @Output() onClick: EventEmitter<number> = new EventEmitter();
  totalPages = 0;
  pages: number[] = [];
  displayedPages: Array<number | string> = [];

  constructor() {}

  ngOnInit() {
    this.calculatePages();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.calculatePages();
  }

  calculatePages() {
    if (this.totalItems) {
      this.totalPages = Math.ceil(this.totalItems / this.itemPerPage);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.updateDisplayedPages();
    }
  }

  updateDisplayedPages() {
    const visiblePages = 6;
    const maxVisiblePages = Math.min(visiblePages, this.totalPages);
    const startPages = this.pages.slice(0, 3);
    const endPages = this.pages.slice(-3);
    const middlePages: number[] = [];

    if (this.totalPages <= visiblePages) {
      this.displayedPages = this.pages;
    } else {
      if (this.currentPage <= 3) {
        this.displayedPages = [...startPages, -1, ...endPages];
      } else if (this.currentPage > this.totalPages - 3) {
        this.displayedPages = [...startPages, -1, ...endPages];
      } else {
        middlePages.push(this.currentPage - 1, this.currentPage, this.currentPage + 1);
        this.displayedPages = [...startPages, -1, ...middlePages, -1, ...endPages];
      }
    }
  }

  pageClicked(page: number | string) {
    if (typeof page === 'number' && page > 0 && page <= this.totalPages) {
      this.onClick.emit(page);
      this.currentPage = page;
      this.updateDisplayedPages();
    }
  }
}


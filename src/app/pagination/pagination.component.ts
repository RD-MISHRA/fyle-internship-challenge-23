import { Component, Input, Output, EventEmitter ,SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() totalItems!: number;
  @Input() itemsPerPage!: number;
  @Input() currentPage!: number;
  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  availableItemsPerPage = [5, 10, 20, 50,100];

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);

  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  onItemsPerPageChange(event: any) {
    const newItemsPerPage = event.target.value;
    this.itemsPerPageChange.emit(newItemsPerPage);
  }

  get pages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalItems'] || changes['itemsPerPage']) {
      console.log('Total Pages:', this.totalPages);
      console.log('Pages Array:', this.pages);
      console.log('Total Pages hellow mr rd mishra:',this.totalItems);
    }
  }


}


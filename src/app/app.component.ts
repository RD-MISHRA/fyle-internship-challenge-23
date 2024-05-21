
import { Component, ViewChild } from '@angular/core';
import { ApiService } from './services/api.service';
import { catchError, forkJoin } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fyle-frontend-challenge';
  @ViewChild('skeletonData') skeletonData: any;
  searchQuery: string = '';
  userData: any; // Define proper type based on the response structure
  userRepos: any[] = [];
  loading: boolean = false;

  // Pagination variables
  skeletons = Array(10).fill(0);

  totalItems = 0;
  itemsPerPage = 10;
  currentPage = 1;

  constructor(private apiService: ApiService) {}

  onPageChange(page: number) {
    this.currentPage = page;
    this.getUserReposAndLanguages();
  }

  onItemsPerPageChange(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1; // Reset to the first page
    this.getUserReposAndLanguages();
  }

  search() {
    if (this.searchQuery.trim() !== '') {
      this.loading = true;
      this.apiService.getUser(this.searchQuery).subscribe(
        (data: any) => {
          this.userData = data;
          console.log('User Data:', this.userData);
          this.getUserReposAndLanguages();
        },
        (error: any) => {
          console.error('Error fetching data:', error);
          this.loading = false;
        }
      );
    } else {
      console.warn('Search query is empty');
    }
  }

  getUserReposAndLanguages() {
    if (this.userData && this.userData.login) {
      this.loading = true;
      this.apiService.getRepos(this.userData.login, this.currentPage, this.itemsPerPage).subscribe(
        (repos: any[]) => {
          this.userRepos = repos;
          this.totalItems = repos.length;
          this.getLanguagesForRepos();
        },
        (error: any) => {
          console.error('Error fetching user repositories:', error);
          this.loading = false;
        }
      );
    } else {
      console.warn('User data not available');
    }
  }

  getLanguagesForRepos() {
    const observables = this.userRepos.map(repo =>
      this.apiService.getLanguages(this.userData.login, repo.name).pipe(
        catchError((error: any) => {
          console.error(`Error fetching languages for ${repo.name}:`, error);
          return [];
        })
      )
    );

    forkJoin(observables).subscribe(
      (languages: any[]) => {
        languages.forEach((lang, index) => {
          this.userRepos[index].languages = lang;
        });
        console.log('Repositories with languages:', this.userRepos);
        this.loading = false;
      },
      (error: any) => {
        console.error('Error fetching languages for repositories:', error);
        this.loading = false;
      }
    );
  }
}

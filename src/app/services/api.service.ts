import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private accessToken = 'WRITE YOR GITHUB ACCESS TOKEN HERE';

  constructor(private httpClient: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`
    });
  }

  private cacheObservable<T>(key: string, observable: Observable<HttpResponse<T>>): Observable<T> {
    const cachedData = localStorage.getItem(key);
    if (cachedData) {
      const data = JSON.parse(cachedData);
      return of(data);
    } else {
      return observable.pipe(
        tap(response => localStorage.setItem(key, JSON.stringify(response.body))),
        map((response: HttpResponse<T>) => response.body as T), // Explicitly cast response body
        catchError((error: any) => {
          console.error('Error:', error);
          return throwError(error);
        })
      );
    }
  }

  getUser(githubUsername: string): Observable<any> {
    const url = `https://api.github.com/users/${githubUsername}`;
    const cacheKey = `user_${githubUsername}`;
    const request = this.httpClient.get(url, {
      headers: this.getHeaders(),
      observe: 'response'
    }).pipe(
      catchError((error: any) => {
        console.error('Error fetching user data:', error);
        return throwError(error);
      })
    );

    return this.cacheObservable(cacheKey, request);
  }

  getRepos(githubUsername: string, page: number = 1, perPage: number = 10): Observable<any[]> {
    const url = `https://api.github.com/users/${githubUsername}/repos`;
    const cacheKey = `repos_${githubUsername}_page${page}_perPage${perPage}`;
    const request = this.httpClient.get<any[]>(url, {
      headers: this.getHeaders(),
      params: {
        page: page.toString(),
        per_page: perPage.toString()
      },
      observe: 'response'
    }).pipe(
      catchError((error: any) => {
        console.error('Error fetching repositories:', error);
        return throwError(error);
      })
    );

    return this.cacheObservable(cacheKey, request);
  }

  getLanguages(owner: string, repo: string): Observable<any> {
    const url = `https://api.github.com/repos/${owner}/${repo}/languages`;
    const cacheKey = `languages_${owner}_${repo}`;
    const request = this.httpClient.get(url, {
      headers: this.getHeaders(),
      observe: 'response'
    }).pipe(
      catchError((error: any) => {
        console.error('Error fetching languages:', error);
        return throwError(error);
      })
    );

    return this.cacheObservable(cacheKey, request);
  }
}

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user data from GitHub API', () => {
    const mockUser = { login: 'testuser', id: 1 };
    const githubUsername = 'testuser';

    service.getUser(githubUsername).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`https://api.github.com/users/${githubUsername}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should fetch repositories from GitHub API', () => {
    const mockRepos = [{ name: 'repo1' }, { name: 'repo2' }];
    const githubUsername = 'testuser';
    const page = 1;
    const perPage = 10;

    service.getRepos(githubUsername, page, perPage).subscribe(repos => {
      expect(repos).toEqual(mockRepos);
    });

    const req = httpMock.expectOne(req => 
      req.url === `https://api.github.com/users/${githubUsername}/repos` &&
      req.params.get('page') === page.toString() &&
      req.params.get('per_page') === perPage.toString()
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockRepos);
  });

  it('should fetch languages from GitHub API', () => {
    const mockLanguages = { JavaScript: 100, TypeScript: 50 };
    const owner = 'testuser';
    const repo = 'testrepo';

    service.getLanguages(owner, repo).subscribe(languages => {
      expect(languages).toEqual(mockLanguages);
    });

    const req = httpMock.expectOne(`https://api.github.com/repos/${owner}/${repo}/languages`);
    expect(req.request.method).toBe('GET');
    req.flush(mockLanguages);
  });

  it('should cache user data', () => {
    const mockUser = { login: 'testuser', id: 1 };
    const githubUsername = 'testuser';
    const cacheKey = `user_${githubUsername}`;

    localStorage.setItem(cacheKey, JSON.stringify(mockUser));

    service.getUser(githubUsername).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    httpMock.expectNone(`https://api.github.com/users/${githubUsername}`);
  });

  it('should handle HTTP errors', () => {
    const githubUsername = 'testuser';

    service.getUser(githubUsername).subscribe(
      () => fail('should have failed with the 404 error'),
      (error) => {
        expect(error.status).toBe(404);
      }
    );

    const req = httpMock.expectOne(`https://api.github.com/users/${githubUsername}`);
    req.flush('User not found', { status: 404, statusText: 'Not Found' });
  });
});
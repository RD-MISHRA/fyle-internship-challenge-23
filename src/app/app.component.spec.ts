import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [FormsModule, HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a search input and button', () => {
    const inputEl = fixture.debugElement.query(By.css('input[type="text"]'));
    const buttonEl = fixture.debugElement.query(By.css('button'));
    expect(inputEl).toBeTruthy();
    expect(buttonEl).toBeTruthy();
  });

  it('should display user data when userData is available', () => {
    component.userData = {
      name: 'John Doe',
      bio: 'Software Developer',
      location: 'Earth',
      about: 'Coding enthusiast',
      public_repos: 10,
      avatar_url: 'https://example.com/avatar.jpg'
    };
    fixture.detectChanges();

    const nameEl = fixture.debugElement.query(By.css('p:nth-child(1)')).nativeElement;
    expect(nameEl.textContent).toContain('John Doe');
  });

  it('should display loading skeleton when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();

    const skeletonEls = fixture.debugElement.queryAll(By.css('.animate-pulse'));
    expect(skeletonEls.length).toBeGreaterThan(0);
  });

  it('should display user repositories when not loading', () => {
    component.loading = false;
    component.userRepos = [
      { name: 'Repo 1', description: 'Description 1', languages: { TypeScript: 100, HTML: 50 } },
      { name: 'Repo 2', description: 'Description 2', languages: { JavaScript: 80, CSS: 20 } }
    ];
    fixture.detectChanges();

    const repoTitles = fixture.debugElement.queryAll(By.css('.text-xl.text-blue-500.font-bold'));
    expect(repoTitles.length).toBe(2);
    expect(repoTitles[0].nativeElement.textContent).toContain('Repo 1');
    expect(repoTitles[1].nativeElement.textContent).toContain('Repo 2');
  });

  it('should trigger search function on button click', () => {
    spyOn(component, 'search');
    const buttonEl = fixture.debugElement.query(By.css('button'));
    buttonEl.triggerEventHandler('click', null);

    expect(component.search).toHaveBeenCalled();
  });

  it('should update searchQuery model on input', () => {
    const inputEl = fixture.debugElement.query(By.css('input[type="text"]')).nativeElement;
    inputEl.value = 'new search query';
    inputEl.dispatchEvent(new Event('input'));

    expect(component.searchQuery).toBe('new search query');
  });
});

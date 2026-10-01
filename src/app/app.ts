import {Component, signal, inject, OnInit, DestroyRef, computed} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {RouterOutlet, ActivatedRoute, Router, RouterLinkActive, RouterLink} from '@angular/router';
import {GiphyApiService} from './core/giphy-api.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { Gif} from './models/gif.model';
import { catchError, distinctUntilChanged, finalize, map, of, switchMap, tap} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, RouterLinkActive, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements  OnInit{
  private readonly route = inject(ActivatedRoute)
  private readonly  router = inject(Router)
  private readonly destroyRef = inject(DestroyRef)
  private readonly giphyApi = inject(GiphyApiService)


  protected query = ''
  protected readonly submittedQuery = signal('')
  protected readonly gifs = signal<Gif[]>([])
  protected readonly isLoading = signal(false)
  protected readonly errorMessage = signal('')
  protected readonly sortMode = signal<'relevance' | 'newest'>('relevance')

  protected readonly sortedGifs = computed(() => {
    const gifs = [...this.gifs()]

    if (this.sortMode() === 'newest') {
      gifs.sort(
        (first, second) =>
          Date.parse(second.createdAt) - Date.parse(first.createdAt)
      )
    }

    return gifs
  })

  ngOnInit():void {
    this.route.queryParamMap.pipe(
      map((params) => (params.get('q') ?? '').trim()),
      distinctUntilChanged(),
      tap((query) => {
        this.query = query
        this.submittedQuery.set(query)
        this.gifs.set([])
        this.errorMessage.set('')
      }),
      switchMap((query) => {
        if (!query) {
          this.isLoading.set(false)
          return of([])
        }

        this.isLoading.set(true)

        return this.giphyApi.searchGifs(query).pipe(
          catchError(() => {
            this.errorMessage.set(
              'GIFs could not be loaded. Check your connection and API key, then try again.'
            )
            return of([])
          }),
          finalize(() => this.isLoading.set(false))
        )
      }),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((gifs) => {
      this.gifs.set(gifs)
    })
  }

  protected submitSearch(): void {
    const query = this.query.trim()

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: query || null },
      queryParamsHandling: 'merge'
    })
  }

  protected updateSortMode(mode: 'relevance' | 'newest'): void {
    this.sortMode.set(mode)
  }
}

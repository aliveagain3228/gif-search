import { DatePipe } from '@angular/common';
import {Component, ElementRef, DestroyRef, OnInit, ViewChild, signal, inject, computed } from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import {RouterOutlet, ActivatedRoute, Router, RouterLinkActive, RouterLink} from '@angular/router';
import {GiphyApiService} from './core/giphy-api.service';
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

  @ViewChild('gifDialog') private gifDialog?: ElementRef<HTMLDialogElement>

  protected query = ''
  protected readonly submittedQuery = signal('')
  protected readonly gifs = signal<Gif[]>([])
  protected readonly isLoading = signal(false)
  protected readonly errorMessage = signal('')
  protected readonly actionMessage = signal('')
  protected readonly selectedGif = signal<Gif | null>(null)
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

  protected openGifDetails(gif: Gif): void {
    this.selectedGif.set(gif)
    this.actionMessage.set('')
    this.gifDialog?.nativeElement.showModal()
  }

  protected closedGifDetails(): void {
    this.gifDialog?.nativeElement.close()
  }

  protected closeDialogOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closedGifDetails()
    }
  }

  protected onDialogClosed(): void {
    this.selectedGif.set(null)
  }

  protected async copyGifLink(gif: Gif): Promise<void> {
    try {
      await navigator.clipboard.writeText(gif.pageUrl)
      this.actionMessage.set('Gif link copied')
    } catch {
      this.actionMessage.set('Could not copy the link. Check browser clipboard permissions')
    }
  }

  protected async downloadGif(gif: Gif): Promise<void> {
    try {
      const response = await fetch(gif.originalUrl)

      if (!response.ok) {
        throw new Error('The GIF download failed')
      }

      const file = await.response.blob()
      const downloadUrl = URL.createObjectURL(file)
      const link = document.createElement('a')
      const fileName = gif.title.replace(/[<>:"/\\|?*\u0000-\u001F]/g, '')
        .trim().replace(/\s+/g, '-') || 'gif')

      link.hreflang = downloadUrl
      link.download = `${fileName}.gif`
      document.body.append(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(downloadUrl)
      this.actionMessage.set('Download started')
    } catch {
      this.actionMessage.set('Direct download was blocked. Use “View on GIPHY”, then save the GIF from there')
    }
  }
}

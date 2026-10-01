import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Gif } from '../models/gif.model';

interface GiphyImage {
  url: string;
  webp?: string;
}

interface GiphyGifResponse {
  id: string;
  title: string;
  url: string;
  import_datetime: string;
  create_datetime: string;
  update_datetime: string;
  username: string;
  alt_text?: string;
  source?: string
  user?: {
    display_name?: string;
  };
  images: {
    fixed_width: GiphyImage;
    original: GiphyImage;
  }
}

interface GiphySearchResponse {
  data: GiphyGifResponse[];
}

@Injectable({
  providedIn: 'root'
})

export class GiphyApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = 'https://api.giphy.com/v1/gifs/search';
  private readonly apiKey = 'vvQhKBT4gv0yBk03NsfOOSdD2qeCUDhu';

  searchGifs(query: string): Observable<Gif[]> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('q', query)
      .set('limit', 24)
      .set('offset', 0)
      .set('rating', 'g')
      .set('lang', 'en')

    return this.http.get<GiphySearchResponse>(this.endpoint, { params })
      .pipe(
        map((response) =>
            response.data.map((gif) => ({
              id: gif.id,
              title: gif.title,
              altText: gif.alt_text || gif.title || 'No description available.',
              previewUrl: gif.images.fixed_width.webp ?? gif.images.fixed_width.url,
              originalUrl: gif.images.original.url,
              pageUrl: gif.url,
              creator: gif.user?.display_name || gif.username || 'Unknown',
              createdAt: gif.import_datetime,
              source: gif.source || gif.url,
            }))
        )
      )
  }
}

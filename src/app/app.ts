import { Component, signal, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {RouterOutlet, ActivatedRoute, Router, RouterLinkActive, RouterLink} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, RouterLinkActive, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements  OnInit{
  private readonly route = inject(ActivatedRoute)
  private readonly  router = inject(Router)

  protected query = ''
  protected readonly submittedQuery = signal('')

  ngOnInit():void {
    this.route.queryParamMap.subscribe((params) => {
      const query = params.get('q') ?? ''
      this.query = query
      this.submittedQuery.set(query)
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
}

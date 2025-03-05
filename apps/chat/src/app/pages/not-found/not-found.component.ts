import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>Страница не найдена</h2>
        <p>Запрашиваемая страница не существует или была перемещена.</p>
        <a routerLink="/" class="home-button">Вернуться на главную</a>
      </div>
    </div>
  `,
  styles: [
    `
      .not-found-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: var(--bg-secondary);
        font-family: var(--font-family);
      }

      .not-found-content {
        text-align: center;
        padding: 2rem;
        background-color: var(--bg-primary);
        border-radius: 8px;
        box-shadow: var(--shadow-light);
        max-width: 500px;
        width: 90%;
      }

      h1 {
        font-size: 6rem;
        margin: 0;
        color: var(--error-color);
      }

      h2 {
        font-size: 2rem;
        margin-top: 0;
        margin-bottom: 1rem;
        color: var(--text-primary);
      }

      p {
        font-size: 1.2rem;
        color: var(--text-secondary);
        margin-bottom: 2rem;
      }

      .home-button {
        display: inline-block;
        padding: 0.8rem 1.5rem;
        background-color: var(--accent-color);
        color: var(--button-text);
        text-decoration: none;
        border-radius: 4px;
        font-weight: var(--font-weight-medium);
        transition: background-color 0.3s;
      }

      .home-button:hover {
        background-color: var(--accent-hover);
      }
    `,
  ],
})
export class NotFoundComponent implements OnInit {
  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}

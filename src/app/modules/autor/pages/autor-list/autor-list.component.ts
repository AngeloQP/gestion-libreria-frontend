import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AutorService } from "../../../../core/services";
import { AutorResponse } from "../../../../core/models";
import { Constants } from "../../../../constants";

@Component({
  selector: 'app-autor-list',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './autor-list.component.html',
  styleUrl: './autor-list.component.scss',
  providers: [AutorService]
})
export class AutorListComponent {

  /** Referencia a las constantes del sistema */
  protected readonly Constants = Constants;

  /** Lista reactiva de autores obtenida del servicio */
  readonly autores = signal<AutorResponse[]>([]);

  /** Página actual del listado */
  currentPage: number = 0;

  /** Total de páginas disponibles para la paginación */
  totalPages: number = 0;

  /** Número de autores mostrados por página */
  pageSize: number = 10;

  /** Servicio de autores para interactuar con la API */
  private autorService: AutorService = inject(AutorService);

  /** Router para la navegación entre vistas */
  private readonly _router = inject(Router);

  /**
   * Constructor del componente. Inicializa dependencias necesarias.
   */
  constructor() {}

  /**
   * Método del ciclo de vida Angular.
   * Carga la lista inicial de autores al inicializar el componente.
   */
  ngOnInit(): void {
    this._cargarAutores(this.currentPage);
  }

  /**
   * Carga los autores desde el servicio con paginación.
   * Actualiza la lista de autores y el total de páginas.
   *
   * @param {number} page - Página que se desea cargar.
   * @private
   */
  private _cargarAutores(page: number): void {
    this.autorService
      .getAutoresPaginado(page, this.pageSize)
      .subscribe((data) => {
        this.autores.set(data.content);
        this.totalPages = data.totalPages;
      });
  }

  /**
   * Cambia la página actual y recarga los autores correspondientes.
   *
   * @param {number} newPage - Nueva página a mostrar.
   */
  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.currentPage = newPage;
      this._cargarAutores(this.currentPage);
    }
  }

  /**
   * Elimina un autor específico por su ID después de confirmación del usuario.
   * Recarga la lista de autores tras la eliminación.
   *
   * @param {number} id - ID del autor a eliminar.
   */
  eliminarAutor(id: number): void {
    if (confirm('¿Estás seguro de eliminar este autor?')) {
      this.autorService
        .deleteAutor(id)
        .subscribe(() => {
          this._cargarAutores(this.currentPage);
        });
    }
  }

  /**
   * Navega a la vista de edición de un autor específico.
   *
   * @param {number} autorId - ID del autor que se desea editar.
   */
  goToEditAutor(autorId: number): void {
    this._router.navigate(['/autor/edit', autorId]);
  }
}

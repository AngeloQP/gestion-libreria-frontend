/**
 * Componente de listado para la gestión de libros.
 * Permite visualizar, paginar, eliminar y editar libros.
 */
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { LibroResponse } from "../../../../core/models";
import { Constants } from "../../../../constants";
import { LibroService } from "../../../../core/services";

@Component({
  selector: 'app-libro-list',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './libro-list.component.html',
  styleUrl: './libro-list.component.scss',
  providers: [LibroService]
})
export class LibroListComponent implements OnInit {

  /**
   * Constantes globales utilizadas en el componente.
   * @protected
   */
  protected readonly Constants = Constants;

  /**
   * Lista de libros para mostrar en la tabla.
   */
  readonly libros = signal<LibroResponse[]>([]);

  /**
   * Página actual del listado.
   */
  currentPage: number = 0;

  /**
   * Número total de páginas disponibles.
   */
  totalPages: number = 0;

  /**
   * Cantidad de libros por página.
   */
  pageSize: number = 5;

  /**
   * Servicio para gestionar libros.
   * @private
   */
  private libroService: LibroService = inject(LibroService);

  /**
   * Servicio para la navegación entre rutas.
   * @private
   */
  private readonly _router = inject(Router);

  /**
   * Constructor del componente.
   */
  constructor() {}

  /**
   * Método del ciclo de vida Angular.
   * Se ejecuta al inicializar el componente.
   * Carga la lista de libros de la primera página.
   */
  ngOnInit(): void {
    this._cargarLibros(this.currentPage);
  }

  /**
   * Carga los libros de una página específica desde el servicio.
   * Actualiza la lista de libros y el total de páginas disponibles.
   *
   * @param {number} page Número de la página a cargar.
   * @private
   */
  private _cargarLibros(page: number): void {
    this.libroService
      .getLibrosPaginado(page, this.pageSize)
      .subscribe((data) => {
        this.libros.set(data.content);
        this.totalPages = data.totalPages;
      });
  }

  /**
   * Cambia a una nueva página del listado si es válida.
   *
   * @param {number} newPage Número de la nueva página.
   */
  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.currentPage = newPage;
      this._cargarLibros(this.currentPage);
    }
  }

  /**
   * Elimina un libro por su ID tras confirmación del usuario.
   * Actualiza la lista de libros después de eliminarlo.
   *
   * @param {number} id ID del libro a eliminar.
   */
  eliminarLibro(id: number): void {
    if (confirm('¿Seguro que desea eliminar este libro?')) {
      this.libroService
        .deleteLibro(id)
        .subscribe(() => {
          this._cargarLibros(this.currentPage);
        });
    }
  }

  /**
   * Navega a la página de edición de un libro específico.
   *
   * @param {number} libroId ID del libro a editar.
   */
  goToEditLibro(libroId: number): void {
    this._router.navigate(['/libro/edit', libroId]);
  }
}

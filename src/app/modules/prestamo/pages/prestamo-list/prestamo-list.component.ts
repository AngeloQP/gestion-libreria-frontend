/**
 * Componente para gestionar la lista de préstamos.
 * Permite visualizar, filtrar, concluir, y eliminar préstamos de libros.
 */
import { Component, inject, OnInit, signal } from '@angular/core';
import { LibroResponse, PrestamoResponse } from "../../../../core/models";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { LibroService, PrestamoService } from "../../../../core/services";
import { Router, RouterLink } from "@angular/router";
import { Constants } from "../../../../constants";

@Component({
  selector: 'app-prestamo-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './prestamo-list.component.html',
  styleUrl: './prestamo-list.component.scss',
  providers: [PrestamoService]
})
export class PrestamoListComponent implements OnInit {

  /**
   * Constantes globales utilizadas en el componente.
   * @protected
   */
  protected readonly Constants = Constants;

  /**
   * Lista reactiva de préstamos cargados desde el servicio.
   */
  readonly prestamos = signal<PrestamoResponse[]>([]);

  /**
   * Lista reactiva de libros disponibles.
   */
  readonly libros = signal<LibroResponse[]>([]);

  /**
   * Página actual para la paginación de préstamos.
   */
  currentPage: number = 0;

  /**
   * Número total de páginas disponibles.
   */
  totalPages: number = 0;

  /**
   * Número de préstamos por página.
   */
  pageSize: number = 10;

  /**
   * Formulario reactivo para filtrar los préstamos.
   */
  form!: FormGroup;

  /**
   * Servicio para gestionar préstamos.
   * @private
   */
  private prestamoService: PrestamoService = inject(PrestamoService);

  /**
   * Servicio para gestionar libros.
   * @private
   */
  private libroService: LibroService = inject(LibroService);

  /**
   * Servicio para gestionar la navegación entre rutas.
   * @private
   */
  private _router: Router = inject(Router);

  /**
   * Constructor para inicializar el formulario.
   * @private
   */
  private fb: FormBuilder = inject(FormBuilder);

  /**
   * Constructor del componente.
   */
  constructor() {}

  /**
   * Método del ciclo de vida Angular.
   * Se ejecuta al inicializar el componente.
   * Inicializa el formulario, carga préstamos y libros.
   */
  ngOnInit(): void {
    this.form = this.fb.group({
      idLibro: [''],
    });

    this.cargarPrestamos(this.currentPage);
    this._getLibros();
  }

  /**
   * Carga los préstamos desde el servicio con paginación y filtros.
   * @param page Número de página a cargar.
   */
  cargarPrestamos(page: number): void {
    const filtros = this.form.value;

    this.prestamoService
      .getPrestamosPaginado(page, this.pageSize, filtros)
      .subscribe((data) => {
        this.prestamos.set(data.content);
        this.totalPages = data.totalPages;
      });
  }

  /**
   * Cambia a una nueva página en la lista de préstamos.
   * @param newPage Página a la que se quiere cambiar.
   */
  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.currentPage = newPage;
      this.cargarPrestamos(this.currentPage);
    }
  }

  /**
   * Marca un préstamo como finalizado.
   * @param id Identificador del préstamo a finalizar.
   */
  concluirPrestamo(id: number): void {
    if (confirm('¿Seguro que desea concluir este préstamo?')) {
      const request = this.prestamos().find(prestamo => prestamo.id === id)!;
      request.fecPrestamo = new Date().toISOString();
      request.estado = 'FINALIZADO';

      this.prestamoService
        .updatePrestamo(request)
        .subscribe(() => {
          alert('El préstamo ha sido finalizado.');
          this.cargarPrestamos(this.currentPage);
        });
    }
  }

  /**
   * Elimina un préstamo seleccionado.
   * @param id Identificador del préstamo a eliminar.
   */
  eliminarPrestamo(id: number): void {
    if (confirm('¿Seguro que desea eliminar este préstamo?')) {
      this.prestamoService
        .deletePrestamo(id)
        .subscribe(() => {
          alert('El préstamo ha sido eliminado.');
          this.cargarPrestamos(this.currentPage);
        });
    }
  }

  /**
   * Navega a la página de edición para un préstamo específico.
   * @param prestamoId Identificador del préstamo a editar.
   */
  goToEditPrestamo(prestamoId: number): void {
    this._router.navigate(['/prestamo/edit', prestamoId]);
  }

  /**
   * Obtiene los préstamos filtrados por libro seleccionado en el formulario.
   */
  getPrestamosPorLibro(): void {
    const idLibro = this.form.controls['idLibro'].value;

    this.prestamoService
      .getPrestamosPorLibro(idLibro)
      .subscribe(data => {
        this.prestamos.set(data);
      });
  }

  /**
   * Carga la lista de libros disponibles para el filtro.
   * @private
   */
  private _getLibros(): void {
    this.libroService
      .getLibros()
      .subscribe((data) => {
        this.libros.set(data);
      });
  }
}

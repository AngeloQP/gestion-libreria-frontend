/**
 * Componente de formulario para la gestión de préstamos.
 * Permite crear o editar préstamos de libros.
 */
import {Component, inject, input, OnInit, signal} from '@angular/core';
import {Constants} from "../../../../constants";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {LibroResponse, PrestamoRequest} from "../../../../core/models";
import {LibroService, PrestamoService} from "../../../../core/services";
import {ActivatedRoute, Router} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-prestamo-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './prestamo-form.component.html',
  styleUrl: './prestamo-form.component.scss'
})
export class PrestamoFormComponent implements OnInit {

  /**
   * Constantes globales utilizadas en el componente.
   * @protected
   */
  protected readonly Constants = Constants;

  /**
   * Identificador del préstamo que se está gestionando.
   * Puede ser nulo si se está creando un nuevo préstamo.
   */
  readonly prestamoId = input<number | null>(null);

  /**
   * Lista reactiva de libros disponibles para el préstamo.
   */
  readonly libros = signal<LibroResponse[]>([]);

  /**
   * Formulario reactivo para la gestión de préstamos.
   */
  form!: FormGroup;

  /**
   * Servicio para construir formularios.
   * @private
   */
  private fb: FormBuilder = inject(FormBuilder);

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
   * Servicio para gestionar rutas activadas.
   * @private
   */
  private route: ActivatedRoute = inject(ActivatedRoute);

  /**
   * Servicio de enrutamiento para la navegación.
   * @public
   */
  public router: Router = inject(Router);

  /**
   * Constructor del componente.
   */
  constructor() {
  }

  /**
   * Método del ciclo de vida Angular.
   * Se ejecuta al inicializar el componente.
   * Inicializa el formulario y carga los datos necesarios.
   */
  ngOnInit(): void {
    this.inicializarFormulario();
    if (this.prestamoId()) {
      this.getPrestamo();
    }
    this.cargarLibros();
  }

  /**
   * Inicializa el formulario reactivo con sus controles y validaciones.
   */
  inicializarFormulario(): void {
    this.form = this.fb.group({
      idLibro: [{value: null, disabled: !!this.prestamoId()}, [Validators.required]],
      lector: ['', [Validators.required]],
      fecPrestamo: [new Date().toISOString().split('T')[0], [Validators.required]],
      estado: ['ACTIVO', [Validators.required]],
      id: [this.prestamoId()],
    });
  }

  /**
   * Carga la lista de libros disponibles para realizar préstamos.
   */
  cargarLibros(): void {
    this.libroService
      .getLibros()
      .subscribe((data) => {
        this.libros.set(data);
      });
  }

  /**
   * Guarda el préstamo actual. Si el préstamo existe, se actualiza. En caso contrario, se crea un nuevo préstamo.
   * @returns {void}
   */
  savePrestamo(): void {
    const request = this.form.value as PrestamoRequest;

    if (this.prestamoId()) {
      this.prestamoService
        .updatePrestamo(request)
        .subscribe(() => {
          this.router.navigate(['/prestamo']);
        });
    } else {
      this.libroService
        .checkDisponibilidadLibro(this._getISBN())
        .subscribe((data) => {
          if (data) {
            this.prestamoService
              .createPrestamo(request)
              .subscribe(() => {
                this.router.navigate(['/prestamo']);
              });
          } else {
            alert('El libro seleccionado no se encuentra disponible')
          }
        })
    }
  }

  /**
   * Obtiene el ISBN del libro seleccionado en el formulario.
   * @private
   * @returns {string} ISBN del libro seleccionado.
   */
  private _getISBN(): string {
    const idLibro: number = this.form.controls['idLibro'].value;
    return this.libros().find(libro => libro.id == idLibro)!.isbn;
  }

  /**
   * Carga los datos de un préstamo existente y actualiza el formulario.
   * @private
   */
  getPrestamo(): void {
    this.prestamoService
      .getPrestamo(this.prestamoId()!)
      .subscribe((prestamo) => {
        this.form.patchValue(prestamo);
      });
  }
}

/**
 * Componente de formulario para la gestión de libros.
 */
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutorService, LibroService } from '../../../../core/services';
import { ActivatedRoute, Router } from '@angular/router';
import { AutorResponse, LibroRequest } from '../../../../core/models';
import { Constants } from '../../../../constants';

@Component({
  selector: 'app-libro-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './libro-form.component.html',
  styleUrl: './libro-form.component.scss'
})
export class LibroFormComponent implements OnInit {

  /**
   * Constantes utilizadas en el componente.
   * @protected
   */
  protected readonly Constants = Constants;

  /**
   * Formulario reactivo para la gestión de libros.
   */
  form!: FormGroup;

  /**
   * ID del libro (si se está editando un libro existente).
   */
  readonly libroId = input<number | null>(null);

  /**
   * Lista de autores disponibles para asociar con el libro.
   */
  readonly autores = signal<AutorResponse[]>([]);

  /**
   * Constructor del FormBuilder.
   * @private
   */
  private fb: FormBuilder = inject(FormBuilder);

  /**
   * Servicio para gestionar libros.
   * @private
   */
  private libroService: LibroService = inject(LibroService);

  /**
   * Servicio para gestionar autores.
   * @private
   */
  private autorService: AutorService = inject(AutorService);

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
  constructor() {}

  /**
   * Ciclo de vida OnInit: se inicializa el formulario y se cargan los datos necesarios.
   */
  ngOnInit(): void {
    this._createForm();
    if (this.libroId() && this.libroId() !== 0) {
      this.getLibro();
    }
    this.getAutores();
  }

  /**
   * Crear el formulario reactivo para la gestión de libros.
   * @private
   */
  private _createForm(): void {
    this.form = this.fb.group({
      titulo: ['', [Validators.required]],
      idAutor: [null, [Validators.required]],
      isbn: ['', [Validators.required]],
      fecPublicacion: ['', [Validators.required]],
      estado: ['DISPONIBLE', [Validators.required]],
      id: [this.libroId()]
    });
  }

  /**
   * Obtener la lista de autores y asignarla al formulario.
   */
  getAutores(): void {
    this.autorService
      .getAutores()
      .subscribe((data) => {
        this.autores.set(data);
      });
  }

  /**
   * Obtener la información de un libro por su ID y actualizar el formulario con esos datos.
   * @private
   */
  private getLibro(): void {
    this.libroService
      .getLibro(this.libroId()!)
      .subscribe((libro) => {
        this.form.patchValue(libro);
      });
  }

  /**
   * Guardar la información del libro. Dependiendo de si el libro ya existe, se creará o se actualizará.
   */
  saveLibro(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const request = this.form.value as LibroRequest;

      if (this.libroId()) {
        this.libroService
          .updateLibro(request)
          .subscribe(() => {
            this.router.navigate(['/libro']);
          });
      } else {
        this.libroService
          .createLibro(request)
          .subscribe(() => {
            this.router.navigate(['/libro']);
          });
      }
    }
  }
}

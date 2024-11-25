import {Component, inject, input, Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AutorRequest } from "../../../../core/models";
import { Constants } from '../../../../constants';
import { AutorService } from "../../../../core/services";

@Component({
  selector: 'app-autor-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './autor-form.component.html',
  styleUrl: './autor-form.component.scss'
})
export class AutorFormComponent implements OnInit {

  /** Referencia a las constantes del sistema */
  protected readonly Constants = Constants;

  /** ID del autor, puede ser nulo si es un nuevo registro */
  readonly autorId = input<number | null>(null);

  /** Formulario reactivo para gestionar los datos del autor */
  form!: FormGroup;

  /** Inyección del FormBuilder para construir formularios reactivos */
  private fb: FormBuilder = inject(FormBuilder);

  /** Servicio para gestionar autores */
  private autorService: AutorService = inject(AutorService);

  /** Ruta activa para capturar parámetros y datos de navegación */
  private route: ActivatedRoute = inject(ActivatedRoute);

  /** Router para navegar entre vistas */
  public router: Router = inject(Router);

  /**
   * Constructor del componente. Inicializa dependencias necesarias.
   */
  constructor() {}

  /**
   * Método del ciclo de vida Angular.
   * Inicializa el formulario y carga datos si se está editando un autor.
   */
  ngOnInit(): void {
    this._createForm();

    if (this.autorId()) {
      this.getAutor();
    }
  }

  /**
   * Crea el formulario reactivo y define las validaciones necesarias.
   * @private
   */
  private _createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      nacionalidad: ['', [Validators.required]],
      fecNacimiento: ['', [Validators.required]],
      id: [this.autorId()]
    });
  }

  /**
   * Obtiene los datos del autor desde el servicio si se está editando.
   * Los datos se cargan en el formulario.
   * @private
   */
  private getAutor(): void {
    this.autorService
      .getAutor(this.autorId()!)
      .subscribe((autor) => {
        this.form.patchValue(autor);
      });
  }

  /**
   * Guarda los datos del autor.
   * Si se trata de un nuevo registro, se crea el autor. Si es una edición, se actualiza.
   */
  saveAutor() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const request = this.form.value as AutorRequest;

      if (this.autorId()) {
        this.autorService
          .updateAutor(request)
          .subscribe(() => {
            this.router.navigate(['/autor']);
          });
      } else {
        this.autorService
          .createAutor(request)
          .subscribe(() => {
            this.router.navigate(['/autor']);
          });
      }
    }
  }
}

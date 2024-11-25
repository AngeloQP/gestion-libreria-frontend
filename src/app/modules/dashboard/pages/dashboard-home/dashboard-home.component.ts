import { Component, inject, OnInit } from '@angular/core';
import { PieChartModule } from "@swimlane/ngx-charts";
import { AutorService, LibroService } from "../../../../core/services";
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    PieChartModule
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent implements OnInit {

  /**
   * Datos de ejemplo para el gráfico circular.
   * Representa datos de prueba estáticos.
   */
  data = [
    {
      "name": "Producto A",
      "value": 40
    },
    {
      "name": "Producto B",
      "value": 30
    },
    {
      "name": "Producto C",
      "value": 30
    }
  ];

  /**
   * Datos de autores organizados por nacionalidad para el gráfico.
   */
  dataAutor: { name: string, value: number }[] = [];

  /**
   * Datos de libros organizados por año para el gráfico.
   */
  dataLibro: { name: string, value: number }[] = [];

  /** Servicio para obtener datos relacionados con autores. */
  private readonly autorService: AutorService = inject(AutorService);

  /** Servicio para obtener datos relacionados con libros. */
  private readonly libroService: LibroService = inject(LibroService);

  /**
   * Constructor del componente.
   */
  constructor() {}

  /**
   * Método del ciclo de vida Angular.
   * Se ejecuta al inicializar el componente y carga los datos iniciales para los gráficos.
   */
  ngOnInit(): void {
    this._cargarDatos();
  }

  /**
   * Carga datos desde los servicios de autores y libros y los procesa para gráficos.
   * Utiliza `forkJoin` para realizar ambas solicitudes de manera concurrente.
   *
   * - Los datos de autores se agrupan por nacionalidad.
   * - Los datos de libros se agrupan por año.
   *
   * @private
   */
  private _cargarDatos(): void {
    forkJoin({
      datosAutor: this.autorService.getAutorPorNacionalidad(),
      datosLibro: this.libroService.getLibrosPorAno()
    })
      .subscribe((data) => {
        // Procesa los datos de autores agrupados por nacionalidad.
        this.dataAutor = Object.keys(data.datosAutor).map((nacionalidad) => ({
          name: nacionalidad,
          value: data.datosAutor[nacionalidad].length
        }));

        // Procesa los datos de libros agrupados por año.
        this.dataLibro = Object.keys(data.datosLibro).map((year) => ({
          name: year,
          value: data.datosLibro[year].length
        }));
      });
  }
}

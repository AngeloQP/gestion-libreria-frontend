/**
 * Servicio para gestionar los libros en la aplicación.
 */
import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LibroRequest, LibroResponse} from '../models';

@Injectable({
  providedIn: 'root'
})
export class LibroService {

  /**
   * URL de la API para la gestión de libros.
   * @private
   */
  private _api: string = `${environment.apiGestionLibreria}/libro`;

  /**
   * Inyección del cliente HTTP.
   * @private
   */
  private _http = inject(HttpClient);

  /**
   * Constructor del servicio.
   */
  constructor() {
  }

  /**
   * Obtener todos los libros.
   * @returns {Observable<LibroResponse[]>} Observable que emite una lista de libros.
   */
  getLibros(): Observable<LibroResponse[]> {
    return this._http.get<LibroResponse[]>(this._api);
  }

  /**
   * Obtener un libro por su ID.
   * @param {number} id - ID del libro.
   * @returns {Observable<LibroResponse>} Observable que emite la información del libro.
   */
  getLibro(id: number): Observable<LibroResponse> {
    return this._http.get<LibroResponse>(`${this._api}/${id}`);
  }

  /**
   * Obtener todos los libros con paginación.
   * @param {number} page - Número de página.
   * @param {number} size - Tamaño de la página.
   * @returns {Observable<any>} Observable que emite la respuesta con los libros paginados.
   */
  getLibrosPaginado(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this._http.get<any>(`${this._api}/paginado`, {params});
  }

  /**
   * Crear un nuevo libro.
   * @param {LibroRequest} libro - Datos del libro a crear.
   * @returns {Observable<LibroResponse>} Observable que emite la información del libro creado.
   */
  createLibro(libro: LibroRequest): Observable<LibroResponse> {
    return this._http.post<LibroResponse>(this._api, libro);
  }

  /**
   * Actualizar un libro existente.
   * @param {LibroRequest} libro - Datos del libro a actualizar.
   * @returns {Observable<LibroResponse>} Observable que emite la información del libro actualizado.
   */
  updateLibro(libro: LibroRequest): Observable<LibroResponse> {
    return this._http.put<LibroResponse>(`${this._api}`, libro);
  }

  /**
   * Obtener los libros agrupados por año de publicación.
   * @returns {Observable<{ [key: string]: any[] }>} Observable que emite un objeto con los años como claves y los libros como valores.
   */
  getLibrosPorAno(): Observable<{ [key: string]: any[] }> {
    return this._http.get<{ [key: string]: any[] }>(`${this._api}/agrupar/ano-publicacion`);
  }

  /**Eliminar un libro.
   * @param {number} id - ID del libro a eliminar.
   * @returns {Observable<void>} Observable que emite una respuesta vacía cuando el libro ha sido eliminado.*/
  deleteLibro(id: number): Observable<void> {
    return this._http.delete<void>(`${this._api}/${id}`);
  }

  /**
   * Verificar la disponibilidad de un libro por su ISBN.
   * @param {string} isbn - ISBN del libro a verificar.
   * @returns {Observable<boolean>} Observable que emite un valor booleano indicando si el libro está disponible.
   */
  checkDisponibilidadLibro(isbn: string): Observable<boolean> {
    return this._http.get<boolean>(`${this._api}/disponibilidad/${isbn}`);
  }
}

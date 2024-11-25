/**
 * Servicio para gestionar los autores en la aplicación.
 */
import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {AutorRequest, AutorResponse} from '../models';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AutorService {

  /**
   * URL de la API para la gestión de autores.
   * @private
   */
  private _api: string = `${environment.apiGestionLibreria}/autor`;

  /**
   * Inyección del cliente HTTP.
   * @private
   */
  private _http = inject(HttpClient);

  /**
   * Obtener todos los autores.
   * @returns {Observable<AutorResponse[]>} Observable que emite una lista de autores.
   */
  getAutores(): Observable<AutorResponse[]> {
    return this._http.get<AutorResponse[]>(this._api);
  }

  /**
   * Obtener todos los autores con paginación.
   * @param {number} page - Número de página.
   * @param {number} size - Tamaño de la página.
   * @returns {Observable<any>} Observable que emite la respuesta con los autores paginados.
   */
  getAutoresPaginado(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this._http.get<any>(`${this._api}/paginado`, {params});
  }

  /**
   * Obtener un autor por su ID.
   * @param {number} id - ID del autor.
   * @returns {Observable<AutorResponse>} Observable que emite la información del autor.
   */
  getAutor(id: number): Observable<AutorResponse> {
    return this._http.get<AutorResponse>(`${this._api}/${id}`);
  }

  /**
   * Crear un nuevo autor.
   * @param {AutorRequest} autor - Datos del autor a crear.
   * @returns {Observable<AutorResponse>} Observable que emite la información del autor creado.
   */
  createAutor(autor: AutorRequest): Observable<AutorResponse> {
    return this._http.post<AutorResponse>(this._api, autor);
  }

  /**
   * Actualizar un autor existente.
   * @param {AutorRequest} autor - Datos del autor a actualizar.
   * @returns {Observable<AutorResponse>} Observable que emite la información del autor actualizado.
   */
  updateAutor(autor: AutorRequest): Observable<AutorResponse> {
    return this._http.put<AutorResponse>(`${this._api}`, autor);
  }

  /**
   * Eliminar un autor.
   * @param {number} id - ID del autor a eliminar.
   * @returns {Observable<void>} Observable que emite una respuesta vacía cuando el autor ha sido eliminado.
   */
  deleteAutor(id: number): Observable<void> {
    return this._http.delete<void>(`${this._api}/${id}`);
  }

  getAutorPorNacionalidad(): Observable<{ [key: string]: any[] }> {
    return this._http.get<{ [key: string]: any[] }>(`${this._api}/agrupar/nacionalidad`);
  }
}

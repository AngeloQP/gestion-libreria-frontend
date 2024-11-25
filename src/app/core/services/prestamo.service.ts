import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {PrestamoRequest, PrestamoResponse} from "../models";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  private _api: string = `${environment.apiGestionLibreria}/prestamo`;
  private _http = inject(HttpClient);

  constructor() {
  }

  // Obtener todos los préstamos
  getPrestamos(): Observable<PrestamoResponse[]> {
    return this._http.get<PrestamoResponse[]>(this._api);
  }

  // Obtener todos los préstamos - Paginado
  getPrestamosPaginado(page: number, size: number, filtros: any): Observable<any> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('filtro', filtros.filtro)
      .set('estado', filtros.estado);

    return this._http.get<any>(`${this._api}/paginado`, {params});
  }

  // Crear un nuevo préstamo
  createPrestamo(prestamo: PrestamoRequest): Observable<PrestamoResponse> {
    return this._http.post<PrestamoResponse>(`${this._api}`, prestamo);
  }

  // Actualizar un prestamo existente
  updatePrestamo(prestamo: PrestamoRequest | PrestamoResponse): Observable<PrestamoResponse> {
    return this._http.put<PrestamoResponse>(`${this._api}`, prestamo);
  }

  // Eliminar un préstamo
  deletePrestamo(id: number): Observable<void> {
    return this._http.delete<void>(`${this._api}/${id}`);
  }

  // Obtener un prestamo por ID
  getPrestamo(id: number): Observable<PrestamoResponse> {
    return this._http.get<PrestamoResponse>(`${this._api}/${id}`);
  }

  // Obtener un prestamo por idLibro
  getPrestamosPorLibro(id: number): Observable<PrestamoResponse[]> {
    return this._http.get<PrestamoResponse[]>(`${this._api}/libro/${id}`);
  }
}

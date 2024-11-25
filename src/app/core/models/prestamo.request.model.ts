export interface PrestamoRequest {
  id:            number;
  idLibro:       number;
  nomLibro:      string;
  isbn:          string;
  fecDevolucion: string;
  fecPrestamo:   string;
  estado:        string;
  lector:        string;
}

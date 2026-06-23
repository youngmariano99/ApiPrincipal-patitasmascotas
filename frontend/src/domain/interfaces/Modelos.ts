export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'ADMIN_ZOONOSIS' | 'VECINO' | 'VETERINARIO';
}

export interface Mascota {
  id: string;
  nombreDueno: string;
  nombre: string;
  especie: string;
  estadoAdopcion: string;
  nivelEnergia: string;
  tamano: string;
  caracteristicas: string; // Puede ser un JSON string
}

export interface MascotaRequest {
  usuarioId: string;
  nombre: string;
  especie: string;
  estadoAdopcion: string;
  nivelEnergia: string;
  tamano: string;
  caracteristicas: string;
}

export interface Producto {
  id: string;
  nombreVendedor: string;
  nombreCategoria: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

export interface ProductoRequest {
  vendedorId: string;
  categoriaId: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
}

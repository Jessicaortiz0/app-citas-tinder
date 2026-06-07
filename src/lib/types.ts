export interface Perfil {
  id_perfil: number;
  id_usuario: number;
  biografia?: string | null;
  altura?: number | null;
  peso?: number | null;
  signo_zodiacal?: string | null;
}

export interface Usuario {
  id_usuario: number;
  nombre: string;
  edad: number;
  genero: string;
  nacionalidad: string;
  ciudad_pais: string;
  verificado: boolean;
  perfil?: Perfil | null;
  fotografias?: { id_fotografia: number; url: string }[];
}

export interface Matchs {
  id_match: number;
  usuario1_id: number;
  usuario2_id: number;
  activo: boolean;
  usuario2?: Usuario; // The other user in the match
}

export interface ChatMessage {
  id_chat: number;
  id_match: number;
  mensaje: string;
  leido: boolean;
}

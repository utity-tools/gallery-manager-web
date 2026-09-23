import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";
import type {
  ApiArtist,
  ApiArtwork,
  ApiGallery,
  ApiShow,
  ArtistDetail,
  ArtistInput,
  ArtworkInput,
  ArtworksPage,
  GalleryInput,
  PaginatedResponse,
  ShowDetail,
  ShowInput,
} from "@/lib/types/models";
import type {
  ApiProduct,
  ApiOrder,
  CreateProductInput,
} from "@/lib/types/store";

interface BackendEnvelope<T> {
  success: boolean;
  data: T;
}

interface BackendErrorEnvelope {
  success: false;
  error: {
    code?: string;
    message: string;
  };
}

/** Thrown by every failed request. A real Error subclass so `instanceof Error` works in hooks. */
export class ApiRequestError extends Error {
  code?: string;
  statusCode: number;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.name = "ApiRequestError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const session = await getSession();
    if (session?.user?.accessToken) {
      config.headers.set("Authorization", `Bearer ${session.user.accessToken}`);
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<BackendErrorEnvelope>) => {
    const backendError = error.response?.data?.error;
    const statusCode = error.response?.status ?? 500;

    // Centralized auth handling: any 401 signs the user out once, here,
    // instead of every caller re-checking statusCode.
    if (statusCode === 401 && typeof window !== "undefined") {
      signOut({ callbackUrl: "/login" });
    }

    return Promise.reject(
      new ApiRequestError(
        backendError?.message ?? error.message ?? "An unexpected error occurred",
        statusCode,
        backendError?.code
      )
    );
  }
);

export async function logout(): Promise<void> {
  await api.post<BackendEnvelope<{ message: string }>>("/auth/logout");
}

export async function getGallery(): Promise<ApiGallery> {
  const { data } = await api.get<BackendEnvelope<ApiGallery>>("/galleries");
  return data.data;
}

export async function updateGallery(id: string, input: GalleryInput): Promise<ApiGallery> {
  const { data } = await api.put<BackendEnvelope<ApiGallery>>(`/galleries/${id}`, input);
  return data.data;
}

export async function getArtworks(
  galleryId: string,
  page = 1,
  limit = 12
): Promise<ArtworksPage> {
  const { data } = await api.get<BackendEnvelope<ArtworksPage>>(
    `/galleries/${galleryId}/artworks`,
    { params: { page, limit } }
  );
  return data.data;
}

export async function getGalleryArtists(galleryId: string): Promise<PaginatedResponse<ApiArtist>> {
  const { data } = await api.get<BackendEnvelope<PaginatedResponse<ApiArtist>>>(
    `/galleries/${galleryId}/artists`
  );
  return data.data;
}

export async function getArtist(id: string): Promise<ArtistDetail> {
  const { data } = await api.get<BackendEnvelope<ArtistDetail>>(`/artists/${id}`);
  return data.data;
}

export async function createArtist(galleryId: string, input: ArtistInput): Promise<ApiArtist> {
  const { data } = await api.post<BackendEnvelope<ApiArtist>>(
    `/galleries/${galleryId}/artists`,
    input
  );
  return data.data;
}

export async function updateArtist(id: string, input: Partial<ArtistInput>): Promise<ArtistDetail> {
  const { data } = await api.put<BackendEnvelope<ArtistDetail>>(`/artists/${id}`, input);
  return data.data;
}

export interface DeleteArtistCascade {
  artworks: number;
  exhibitions: number;
  artfairs: number;
}

/** Unlike every other endpoint here, the documented response is NOT wrapped in {success, data} — `cascaded` sits alongside `success`. */
export async function deleteArtist(id: string): Promise<DeleteArtistCascade> {
  const { data } = await api.delete<{ success: boolean; cascaded: DeleteArtistCascade }>(
    `/artists/${id}`
  );
  return data.cascaded;
}

export async function createArtwork(galleryId: string, input: ArtworkInput): Promise<ApiArtwork> {
  const { data } = await api.post<BackendEnvelope<ApiArtwork>>(
    `/galleries/${galleryId}/artworks`,
    input
  );
  return data.data;
}

export async function updateArtwork(
  id: string,
  input: Partial<ArtworkInput>
): Promise<ApiArtwork> {
  const { data } = await api.put<BackendEnvelope<ApiArtwork>>(`/artworks/${id}`, input);
  return data.data;
}

export async function deleteArtwork(id: string): Promise<void> {
  await api.delete(`/artworks/${id}`);
}

export async function getShows(galleryId: string): Promise<PaginatedResponse<ApiShow>> {
  const { data } = await api.get<BackendEnvelope<PaginatedResponse<ApiShow>>>(`/galleries/${galleryId}/shows`);
  return data.data;
}

export async function getShow(id: string): Promise<ShowDetail> {
  const { data } = await api.get<BackendEnvelope<ShowDetail>>(`/shows/${id}`);
  return data.data;
}

export async function createShow(galleryId: string, input: ShowInput): Promise<ShowDetail> {
  const { data } = await api.post<BackendEnvelope<ShowDetail>>(
    `/galleries/${galleryId}/shows`,
    input
  );
  return data.data;
}

export async function updateShow(id: string, input: Partial<ShowInput>): Promise<ShowDetail> {
  const { data } = await api.put<BackendEnvelope<ShowDetail>>(`/shows/${id}`, input);
  return data.data;
}

export async function deleteShow(id: string): Promise<void> {
  await api.delete(`/shows/${id}`);
}

const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;

export async function uploadImage(file: File, galleryId: string): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files allowed");
  }
  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("File too large (max 10MB)");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("galleryId", galleryId);

  const { data } = await api.post<BackendEnvelope<{ url: string }>>("/upload", formData, {
    headers: { "Content-Type": undefined },
  });

  return data.data.url;
}

export async function getProducts(
  galleryId: string,
  page = 1,
  limit = 12
): Promise<PaginatedResponse<ApiProduct>> {
  const { data } = await api.get<BackendEnvelope<PaginatedResponse<ApiProduct>>>(
    `/galleries/${galleryId}/products`,
    { params: { page, limit } }
  );
  return data.data;
}

export async function createProduct(
  galleryId: string,
  input: CreateProductInput
): Promise<ApiProduct> {
  const { data } = await api.post<BackendEnvelope<ApiProduct>>(
    `/galleries/${galleryId}/products`,
    input
  );
  return data.data;
}

export async function updateProduct(
  galleryId: string,
  productId: string,
  input: Partial<CreateProductInput>
): Promise<ApiProduct> {
  const { data } = await api.put<BackendEnvelope<ApiProduct>>(
    `/galleries/${galleryId}/products/${productId}`,
    input
  );
  return data.data;
}

export async function deleteProduct(
  galleryId: string,
  productId: string
): Promise<void> {
  await api.delete(`/galleries/${galleryId}/products/${productId}`);
}

export async function getOrders(
  galleryId: string,
  page = 1,
  limit = 12
): Promise<PaginatedResponse<ApiOrder>> {
  const { data } = await api.get<BackendEnvelope<PaginatedResponse<ApiOrder>>>(
    `/galleries/${galleryId}/orders`,
    { params: { page, limit } }
  );
  return data.data;
}

export async function updateOrderStatus(
  galleryId: string,
  orderId: string,
  status: "processing" | "shipped" | "delivered"
): Promise<ApiOrder> {
  const { data } = await api.put<BackendEnvelope<ApiOrder>>(
    `/galleries/${galleryId}/orders/${orderId}`,
    { orderStatus: status }
  );
  return data.data;
}

export default api;

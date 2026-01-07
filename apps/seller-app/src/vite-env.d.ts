

interface ImportMetaEnv {
  readonly VITE_AUTH_API?: string;
  readonly VITE_PRODUCT_API?: string;
  readonly VITE_ORDER_API?: string;
  readonly VITE_CATEGORY_API?: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME?: string;
  readonly VITE_CLOUDINARY_UPLOAD_PRESET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

import * as yup from "yup";

// Product Validation Schema
export const productSchema = yup.object().shape({
    name: yup
        .string()
        .required("Product name is required")
        .trim()
        .min(3, "Too short product name")
        .max(100, "Too long product name"),

    description: yup
        .string()
        .required("Product description is required")
        .min(5, "Too short product description"),

    price: yup
        .number()
        .typeError("Price must be a number")
        .max(200000, "Too long product price")
        .positive("Price must be a positive number")
        .optional(),

    category: yup
        .string()
        .required("Product category is required"),

    sizes: yup
        .array()
        .of(yup.string().required())
        .min(1, "At least one size is required")
        .required("Product sizes are required"),

    colors: yup
        .array()
        .of(yup.string().required())
        .min(1, "At least one color is required")
        .required("Product colors are required"),

    images: yup
        .array()
        .of(yup.string().required())
        .min(1, "At least one image is required")
        .required("Product images are required"),
});

// Contact Us Validation Schema
export const contactUsSchema = yup.object().shape({
    name: yup
        .string()
        .required("Name is required")
        .trim(),

    email: yup
        .string()
        .required("Email is required")
        .trim()
        .lowercase()
        .email("Please enter a valid email address"),

    message: yup
        .string()
        .required("Message is required")
        .min(10, "Message is too short"),
});

// Type inference for TypeScript
export type ProductFormData = yup.InferType<typeof productSchema>;
export type ContactUsFormData = yup.InferType<typeof contactUsSchema>;

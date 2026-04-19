import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/* ---------------- ENUM ---------------- */
export const roleEnum = pgEnum("role", ["ADMIN", "USER"]);

/* ---------------- USER ---------------- */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: roleEnum("role").default("USER"),
});

/* ---------------- PRODUCT ---------------- */
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  price: integer("price").notNull(),
  salesPrice: integer("sales_price").notNull(),
  quantity: integer("quantity").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* ---------------- FAVORITE ---------------- */
export const favorites = pgTable(
  "favorites",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id").notNull(),
    productId: uuid("product_id").notNull(),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    uniqueFavorite: uniqueIndex("favorites_user_product_unique").on(
      table.userId,
      table.productId,
    ),
  }),
);

/* ---------------- CART ---------------- */
export const cart = pgTable(
  "cart",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id").notNull(),
    productId: uuid("product_id").notNull(),

    quantity: integer("quantity").default(1),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    uniqueCart: uniqueIndex("cart_user_product_unique").on(
      table.userId,
      table.productId,
    ),
  }),
);

/* ---------------- BLOG ---------------- */
export const blogs = pgTable("blogs", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull().unique(),
  blogPhoto: text("blog_photo").notNull(),
  shortText: text("short_text").notNull(),
  text: text("text").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

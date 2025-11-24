CREATE TABLE "todos" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"user_todo_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" text PRIMARY KEY NOT NULL,
	"user_todo_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_user_todo_id_unique" UNIQUE("user_todo_id")
);
--> statement-breakpoint
ALTER TABLE "todos" ADD CONSTRAINT "todos_user_todo_id_users_user_todo_id_fk" FOREIGN KEY ("user_todo_id") REFERENCES "public"."users"("user_todo_id") ON DELETE cascade ON UPDATE no action;
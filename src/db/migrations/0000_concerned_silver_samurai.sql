CREATE TABLE `inspiration_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`source_url` text,
	`content` text NOT NULL,
	`author_handle` text,
	`tags` text,
	`created_at` integer DEFAULT (cast(unixepoch() as int)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `inspiration_posts_key_unique` ON `inspiration_posts` (`key`);--> statement-breakpoint
CREATE INDEX `inspiration_posts_created_at_idx` ON `inspiration_posts` (`created_at`);--> statement-breakpoint
CREATE TABLE `x_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`content` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`post_type` text DEFAULT 'standard' NOT NULL,
	`used` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch() as int)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch() as int)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `x_posts_key_unique` ON `x_posts` (`key`);--> statement-breakpoint
CREATE INDEX `x_posts_status_idx` ON `x_posts` (`status`);--> statement-breakpoint
CREATE INDEX `x_posts_post_type_idx` ON `x_posts` (`post_type`);--> statement-breakpoint
CREATE INDEX `x_posts_created_at_idx` ON `x_posts` (`created_at`);
CREATE TABLE `reels` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`email` varchar(255) NOT NULL,
	`bucket_key` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`confirmation_token` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`delivery_date` timestamp NOT NULL,
	`status` enum('delivered','shipped','failed','unconfirmed') NOT NULL,
	`user_id` int);
--> statement-breakpoint
CREATE TABLE `user_social_accounts` (
	`provider` enum('google') NOT NULL,
	`user_id` int NOT NULL,
	`social_login_id` varchar(100),
	PRIMARY KEY(`provider`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`first_name` varchar(255),
	`last_name` varchar(255),
	`email` varchar(255) NOT NULL,
	`password` varchar(100),
	`confirmation_token` varchar(255),
	`confirmation_token_expires_at` timestamp,
	`verified` boolean NOT NULL DEFAULT false,
	`password_token` varchar(100),
	`password_token_expires_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()));
--> statement-breakpoint
ALTER TABLE `reels` ADD CONSTRAINT `reels_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE set null;--> statement-breakpoint
ALTER TABLE `user_social_accounts` ADD CONSTRAINT `user_social_accounts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade;
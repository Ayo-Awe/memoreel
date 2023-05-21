-- Custom SQL migration file, put you code below! --
ALTER TABLE users
ADD CONSTRAINT uc_email UNIQUE (email);

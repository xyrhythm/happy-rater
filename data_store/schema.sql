CREATE TABLE IF NOT EXISTS rater (
	rater_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  # email.
  account VARCHAR(128) NOT NULL UNIQUE,
  password VARCHAR(128) NOT NULL,
  username VARCHAR(32) NOT NULL,
  created_timestamp TIMESTAMP NOT NULL,
  modified_timestamp TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS requester (
	requester_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  # email
  account VARCHAR(128) NOT NULL UNIQUE,
  password VARCHAR(128) NOT NULL,
  username VARCHAR(32) NOT NULL,
  created_timestamp TIMESTAMP NOT NULL,
  modified_timestamp TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS admin (
  # email
  account VARCHAR(128) NOT NULL PRIMARY KEY,
  password VARCHAR(128) NOT NULL,
  username VARCHAR(32) NOT NULL,
  created_timestamp TIMESTAMP NOT NULL,
  modified_timestamp TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS task (
	task_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  # foreign key?
  requester_id INT NOT NULL,
	name VARCHAR(128) NOT NULL,
  type ENUM('detection', 'classification', 'segmentation') NOT NULL,
  instruction VARCHAR(256) NOT NULL,
  question_string VARCHAR(128) NOT NULL,
  answer_options_json TEXT,
  created_timestamp TIMESTAMP NOT NULL,
  modified_timestamp TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS ratertask (
  rater_id INT NOT NULL,
  task_id INT NOT NULL,
  num_answer INT,
  PRIMARY KEY(rater_id, task_id)
);

CREATE TABLE IF NOT EXISTS requestertask (
  requester_id INT NOT NULL,
  task_id INT NOT NULL,
  num_question INT,
  num_answer_collected INT,
  PRIMARY KEY(requester_id, task_id)
);

CREATE TABLE IF NOT EXISTS question (
	question_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  # foreign key?
  task_id INT NOT NULL,
	image_url VARCHAR(256)
);

CREATE TABLE IF NOT EXISTS answer (
  task_id INT NOT NULL,
  question_id INT NOT NULL,
  rater_id INT NOT NULL,
	answer_json TEXT,
	PRIMARY KEY(task_id, question_id, rater_id)
);

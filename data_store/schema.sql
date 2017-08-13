CREATE TABLE IF NOT EXISTS rater (
	rater_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  # email.
  rater_account VARCHAR(128) NOT NULL UNIQUE,
  rater_username VARCHAR(32) NOT NULL,
  rater_registration_timetamp TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS requester (
	requester_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  # email
  requester_account VARCHAR(128) NOT NULL,
  requester_username VARCHAR(32) NOT NULL,
  requester_registration_timetamp TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS task (
	task_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  # foreign key?
  task_requester_id INT NOT NULL,
	task_name VARCHAR(128) NOT NULL,
  task_type ENUM('object-detection', 'classification', 'segmentation') NOT NULL,
  task_instruction VARCHAR(256) NOT NULL,
  task_question_string VARCHAR(128) NOT NULL,
  # comma-separated answer strings.
  task_answer_options VARCHAR(256),
  task_creation_timestamp TIMESTAMP NOT NULL
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
